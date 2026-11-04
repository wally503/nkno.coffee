"""
Brew draws: how a brew takes grams out of a lot.

Rules (all enforced here, in one place):
  * A draw is recorded as a LotBrewBridge row. Usually a brew has one row.
  * Only open lots can be drawn from. A thawed lot is opened on the spot (dated at
    the brew). Sealed and frozen lots are refused; closed lots are refused.
  * Doses are stored to 3 decimals on the brew but lots work in 2, so the draw is
    rounded half-up to 2 decimals.
  * The optional "correction" sets the lot's remaining weight first (and is logged
    as an ADJUSTED event), so a lot whose recorded weight has drifted can still be
    brewed from.
  * Split brews: when the dose is more than the chosen lot holds, the caller may name
    a second lot. The first lot is drained and closed (reason "Finished", dated at
    the brew) and its row is flagged is_closing; the rest comes from the second lot.
    Without a second lot the draw is refused with LotShortfall, which carries the
    numbers so the form can offer the split.
  * A closed lot's weight is final. Changing a brew's dose or lot, or deleting it,
    is refused when a lot it drew from is closed. The one exception is the closed
    half of a split brew: editing a split brew's dose changes only the still-open
    lot's share, and the dose can't go below what the closed lot supplied.

Every public function runs inside transaction.atomic() and locks the lot row(s)
with select_for_update(), so two saves can't both read the same remaining weight.
"""

from decimal import Decimal, ROUND_HALF_UP

from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import Q

from brew.lifecycle_log import log_lot_change
from brew.models import LotBrewBridge

from .enums import LifecycleKind, LotState
from .lifecycle import close_lot, open_lot, state_of
from .models import CloseReason, LotSplit

TWO_PLACES = Decimal("0.01")

# After a brew, a lot at or under this many grams gets a "close it?" prompt.
CLOSE_PROMPT_THRESHOLD = Decimal("10")

# The close reason a brew uses when it drains a lot (split brews).
FINISHED_REASON_NAME = "Finished"


class LotShortfall(ValidationError):
    """The dose is more than the chosen lot holds. Carries the numbers for the split offer."""

    def __init__(self, remaining: Decimal, needed: Decimal):
        self.remaining = remaining
        self.needed = needed
        super().__init__(
            f"Only {remaining} g left in that lot, but this brew needs {needed} g. "
            "Split it across two lots, or use the lot weight correction."
        )


def to_grams(weight) -> Decimal:
    """Round a dose (3 decimals on the brew) to the 2 decimals lots use."""
    grams = Decimal(str(weight)).quantize(TWO_PLACES, rounding=ROUND_HALF_UP)
    if grams <= 0:
        raise ValidationError("Dose is too small to draw from a lot.")
    return grams


def _lock(*lots: LotSplit) -> dict[int, LotSplit]:
    """Re-read the lots under a row lock (ordered by pk so two locks can't deadlock)."""
    pks = sorted({lot.pk for lot in lots})
    locked = (
        LotSplit.objects.select_for_update()
        .select_related("bean", "vessel")
        .filter(pk__in=pks)
        .order_by("pk")
    )
    return {lot.pk: lot for lot in locked}


def _move_weight(lot: LotSplit, grams: Decimal) -> None:
    """Take `grams` out of the lot. A negative number gives grams back."""
    new_remaining = lot.remaining_weight - grams
    if new_remaining < 0:
        raise ValidationError(
            f"Only {lot.remaining_weight} g left in that lot. "
            "Use the lot weight correction to fix it first."
        )
    lot.remaining_weight = new_remaining
    lot.save()  # clean() rejects anything above stored weight


def _forbid_closed(lot: LotSplit) -> None:
    if lot.closed_at is not None:
        raise ValidationError(
            "This brew drew from a closed lot, so its weight can't change."
        )


def _ensure_drawable(lot: LotSplit, when) -> None:
    if lot.closed_at is not None:
        raise ValidationError("That lot is closed, so it can't be brewed from.")
    state = state_of(lot)
    if state is LotState.THAWED:
        open_lot(lot, opened_at=when)  # open-and-use, dated at the brew
    elif state is not LotState.OPEN:
        raise ValidationError(
            f"That lot is {state.value}. Open it before brewing from it."
        )


def _correct_remaining(lot: LotSplit, new_remaining, when) -> None:
    new_remaining = Decimal(str(new_remaining)).quantize(TWO_PLACES, rounding=ROUND_HALF_UP)
    if new_remaining < 0 or new_remaining > lot.stored_weight:
        raise ValidationError(
            f"Corrected weight must be between 0 and the lot's stored weight ({lot.stored_weight} g)."
        )
    old = lot.remaining_weight
    if new_remaining == old:
        return
    lot.remaining_weight = new_remaining
    lot.save()
    log_lot_change(lot, LifecycleKind.ADJUSTED, when, detail=f"{old} → {new_remaining} g")


def _finished_reason() -> CloseReason:
    reason = CloseReason.objects.filter(
        name=FINISHED_REASON_NAME, is_active=True, carries_weight=False
    ).first()
    if reason is None:
        raise ValidationError(f"Add an active '{FINISHED_REASON_NAME}' close reason first.")
    return reason


def default_lot_for(bean) -> LotSplit | None:
    """
    The lot a brew should draw from when the request doesn't name one: the bean's only
    drawable lot (open, or thawed and ready to open). None if there are none or several,
    so the caller can ask the user to pick.
    """
    drawable = LotSplit.objects.filter(bean=bean, closed_at__isnull=True).filter(
        Q(opened_at__isnull=False) | Q(thawed_at__isnull=False)
    )
    lots = list(drawable[:2])
    return lots[0] if len(lots) == 1 else None


def close_prompt_for(lot: LotSplit) -> dict | None:
    """The 'close this lot?' prompt shown after a new brew: the lot is still open and nearly empty."""
    if lot.closed_at is not None or lot.remaining_weight > CLOSE_PROMPT_THRESHOLD:
        return None
    vessel = "Original bag" if lot.vessel is None else str(lot.vessel)
    return {
        "lot_id": lot.pk,
        "label": f"{lot.bean.name} – {vessel}",
        "remaining": str(lot.remaining_weight),
    }


# ---------------------------------------------------------------------------
# Draw
# ---------------------------------------------------------------------------

def draw_from_lot(
    brew, lot: LotSplit, weight, correct_remaining=None, split_lot: LotSplit | None = None
) -> list[LotBrewBridge]:
    """
    A new brew takes its dose from `lot` (and, for a split, from `split_lot` too).
    Returns the bridge rows written: one normally, two for a split (closing row first).
    `split_lot` is ignored when the dose fits in `lot`.
    """
    grams = to_grams(weight)
    with transaction.atomic():
        locked = _lock(*(l for l in (lot, split_lot) if l is not None))
        first = locked[lot.pk]
        _ensure_drawable(first, brew.date)
        if correct_remaining is not None:
            _correct_remaining(first, correct_remaining, brew.date)

        if grams <= first.remaining_weight:
            _move_weight(first, grams)
            return [LotBrewBridge.objects.create(brew=brew, lot=first, grams=grams)]

        if split_lot is None:
            raise LotShortfall(first.remaining_weight, grams)
        return _draw_split(brew, first, locked[split_lot.pk], grams)


def _draw_split(brew, first: LotSplit, second: LotSplit, grams: Decimal) -> list[LotBrewBridge]:
    if second.pk == first.pk:
        raise ValidationError("Pick a different lot for the rest of the dose.")
    if second.bean_id != first.bean_id:
        raise ValidationError("The other lot belongs to a different bean.")
    if first.remaining_weight <= 0:
        raise ValidationError(
            "That lot is empty. Fix its weight with the correction, or brew from another lot."
        )
    _ensure_drawable(second, brew.date)

    first_grams = first.remaining_weight
    rest = grams - first_grams
    if rest > second.remaining_weight:
        raise ValidationError(
            f"The other lot only has {second.remaining_weight} g, but {rest} g is needed from it."
        )

    reason = _finished_reason()
    _move_weight(second, rest)
    _move_weight(first, first_grams)          # drains it to 0
    close_lot(first, reason, closed_at=brew.date)
    return [
        LotBrewBridge.objects.create(brew=brew, lot=first, grams=first_grams, is_closing=True),
        LotBrewBridge.objects.create(brew=brew, lot=second, grams=rest),
    ]


# ---------------------------------------------------------------------------
# Edit
# ---------------------------------------------------------------------------

def adjust_draw(brew, new_lot: LotSplit | None, new_weight, correct_remaining=None) -> None:
    """
    A brew was edited. `new_lot` None means "the lot didn't change".
    Brews that were never linked to a lot (made before lots existed) stay unlinked
    unless a lot is supplied.
    """
    with transaction.atomic():
        bridges = list(
            LotBrewBridge.objects.select_for_update()
            .select_related("lot")
            .filter(brew=brew)
            .order_by("id")
        )
        if not bridges:
            if new_lot is not None:
                draw_from_lot(brew, new_lot, new_weight, correct_remaining)
            return

        new_grams = to_grams(new_weight)
        if len(bridges) == 1:
            _adjust_single(brew, bridges[0], new_lot, new_grams, correct_remaining)
        else:
            _adjust_split(bridges, new_lot, new_grams)


def _adjust_single(brew, bridge: LotBrewBridge, new_lot, new_grams: Decimal, correct_remaining) -> None:
    same_lot = new_lot is None or new_lot.pk == bridge.lot_id

    if same_lot:
        if new_grams == bridge.grams:
            return  # dose didn't change: nothing to do (and no closed-lot check)
        lot = _lock(bridge.lot)[bridge.lot_id]
        _forbid_closed(lot)
        _move_weight(lot, new_grams - bridge.grams)
        bridge.grams = new_grams
        bridge.save()
        return

    locked = _lock(bridge.lot, new_lot)
    old_lot = locked[bridge.lot_id]
    target = locked[new_lot.pk]
    _forbid_closed(old_lot)
    _ensure_drawable(target, brew.date)
    if correct_remaining is not None:
        _correct_remaining(target, correct_remaining, brew.date)
    _move_weight(old_lot, -bridge.grams)       # give the old lot its grams back
    _move_weight(target, new_grams)            # take from the new lot
    bridge.lot = target
    bridge.grams = new_grams
    bridge.save()


def _adjust_split(bridges: list[LotBrewBridge], new_lot, new_grams: Decimal) -> None:
    """
    A split brew has a closing row (the drained, closed lot) and one other row.
    A dose change lands on the other row; the closing row's share is fixed.
    """
    closing = next((b for b in bridges if b.is_closing), None)
    others = [b for b in bridges if not b.is_closing]
    if closing is None or len(others) != 1:
        raise ValidationError(
            "This brew draws from several lots in a way that can't be edited here. Fix it in the admin."
        )
    other = others[0]

    if new_lot is not None and new_lot.pk not in {b.lot_id for b in bridges}:
        raise ValidationError("A brew split across two lots can't be moved to another lot.")

    total = closing.grams + other.grams
    if new_grams == total:
        return

    lot = _lock(other.lot)[other.lot_id]
    _forbid_closed(lot)
    new_other = new_grams - closing.grams
    if new_other <= 0:
        raise ValidationError(
            f"The dose can't go below {closing.grams} g, which the closed lot already supplied."
        )
    _move_weight(lot, new_other - other.grams)
    other.grams = new_other
    other.save()


# ---------------------------------------------------------------------------
# Delete
# ---------------------------------------------------------------------------

def restore_draw(brew) -> None:
    """A brew is being deleted: give its grams back to its lot(s). Refused if any lot is closed."""
    with transaction.atomic():
        bridges = list(
            LotBrewBridge.objects.select_for_update()
            .select_related("lot")
            .filter(brew=brew)
            .order_by("id")
        )
        if not bridges:
            return
        locked = _lock(*(b.lot for b in bridges))
        if any(lot.closed_at is not None for lot in locked.values()):
            raise ValidationError(
                "This brew drew from a closed lot, so it can't be deleted here. Fix it in the admin."
            )
        for bridge in bridges:
            _move_weight(locked[bridge.lot_id], -bridge.grams)
            bridge.delete()
