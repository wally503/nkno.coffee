from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
from .models import LotSplit, Bean, CloseReason
from collections.abc import Iterable
from enum import Enum
from decimal import Decimal
from dataclasses import dataclass
from .enums import LotState, LifecycleKind, Granularity
from brew.lifecycle_log import log_lifecycle_event

@dataclass
class LotTarget:
    vessel: Vessel | None
    weight: Decimal
    state: LotState

REQUIRED = {
    LotState.SEALED: [],
    LotState.FROZEN: ["frozen_at"],
    LotState.THAWED: ["frozen_at", "thawed_at"],
    LotState.OPEN:   ["opened_at"],
}
FORBIDDEN = {
    LotState.SEALED: ["frozen_at", "thawed_at", "opened_at"],
    LotState.FROZEN: ["thawed_at", "opened_at"],
    LotState.THAWED: ["opened_at"],
    LotState.OPEN:   [],
}
ALLOWED_TARGET_STATES = {
    LotState.SEALED: {LotState.FROZEN, LotState.OPEN},
    LotState.FROZEN: {LotState.FROZEN, LotState.OPEN},
    LotState.THAWED: {LotState.OPEN},
    LotState.OPEN:   {LotState.OPEN},
}
TRANSFER_REASON_NAME = "Transferred"

def state_of(lot: LotSplit) -> LotState:
    if lot.opened_at:
        return LotState.OPEN
    if lot.thawed_at:
        return LotState.THAWED
    if lot.frozen_at:
        return LotState.FROZEN
    return LotState.SEALED

def validate_lot_state(lot: LotSplit, state: LotState):
    if not isinstance(state, LotState):
        raise ValidationError("State must be a valid LotState to validate values.")
    lot_required = REQUIRED[state]
    lot_forbidden = FORBIDDEN[state]

    for lr in lot_required:
        value = getattr(lot, lr)
        if value is None:
            raise ValidationError(f"{state.name} state change requires field {lr} to have a value.")

    for lf in lot_forbidden:
        value = getattr(lot, lf)
        if value:
            raise ValidationError(f"{state.name} state change may not have a value on field {lf}.")

def mark_bean_finished_if_done(bean: Bean) -> None:
    has_open = LotSplit.objects.filter(bean=bean, closed_at__isnull=True).exists()
    bean.finished = not has_open
    bean.save(update_fields=["finished"])

def close_lot(lot: LotSplit, reason: CloseReason, closed_at=None, leftover=None, update_bean=True):
    closed_at = closed_at or timezone.now()
    with transaction.atomic():
        if lot.closed_at is not None:
            raise ValidationError("Lot is already closed.")
        if not reason.is_active:
            raise ValidationError("Reason is retired, please use another.")
        if not reason.carries_weight and lot.remaining_weight is not None and lot.remaining_weight > 0:
            # if leftover is not None:
            #     lot.leftover_weight = leftover
            # else:
            lot.leftover_weight = lot.remaining_weight
        else:
            lot.leftover_weight = None
        lot.remaining_weight = 0
        lot.close_reason = reason
        lot.closed_at = closed_at
        lot.save()

        if update_bean:
            mark_bean_finished_if_done(lot.bean)

def thaw_lot(lot: LotSplit, thawed_at=None):
    thawed_at = thawed_at or timezone.now()
    with transaction.atomic():
        if lot.closed_at is not None:
            raise ValidationError("Lot was already closed, cannot thaw.")
        if not lot.frozen_at:
            raise ValidationError("Lot was never frozen, cannot thaw.")
        if lot.thawed_at is not None:
            raise ValidationError("Lot is already thawed.")
        if lot.opened_at is not None:
            raise ValidationError("Lot was already opened, cannot thaw.")
        lot.thawed_at = thawed_at
        lot.save()
        return lot

def batch_thaw(lots: Iterable[LotSplit], thawed_at=None):
    thawed_at = thawed_at or timezone.now()
    thawed: list[LotSplit] = []
    with transaction.atomic():
        for lot in lots:
            result = thaw_lot(lot, thawed_at)
            thawed.append(result)
    return thawed

def freeze_lot(lot: LotSplit, frozen_at=None):
    frozen_at = frozen_at or timezone.now()
    with transaction.atomic():
        if lot.closed_at is not None:
            raise ValidationError("Lot was already closed, cannot freeze.")
        if lot.thawed_at is not None:
            raise ValidationError("Lot is already thawed, cannot freeze.")
        if lot.opened_at is not None:
            raise ValidationError("Lot was already opened, cannot freeze.")
        if lot.frozen_at is not None:
            raise ValidationError("Lot was already frozen, cannot freeze again.")
        lot.frozen_at = frozen_at
        lot.save()
        return lot

def batch_freeze(lots: Iterable[LotSplit], frozen_at=None):
    frozen_at = frozen_at or timezone.now()
    frozen: list[LotSplit] = []
    with transaction.atomic():
        for lot in lots:
            result = freeze_lot(lot, frozen_at)
            frozen.append(result)
    return frozen

def open_lot(lot: LotSplit, opened_at=None, parent_lot=None):
    opened_at = opened_at or timezone.now()
    with transaction.atomic():
        if lot.closed_at is not None:
            raise ValidationError("Lot was already closed, cannot open.")
        if lot.frozen_at is not None and not lot.thawed_at:
            raise ValidationError("Lot is frozen but not thawed, cannot open yet. Please thaw first.")
        if lot.opened_at is not None:
            raise ValidationError("Lot was already opened, cannot open again.")

        open_count = LotSplit.objects.filter(
            bean=lot.bean, 
            opened_at__isnull=False, 
            closed_at__isnull=True
        ).count()
        if open_count >= 2:
            raise ValidationError("Opening this lot would exceed the max open lot per bean of 2. Please close an open lot first.")
        
        lot.opened_at = opened_at
        lot.save()
        log_lifecycle_event(
            bean=lot.bean, 
            kind=LifecycleKind.OPENED, 
            at=lot.opened_at, 
            granularity=Granularity.GRANULAR,
            lot=lot,
            summary=f"Opened {lot.vessel or "Original bag"}",
            parent=parent_lot
        )
        return lot

def batch_open(lots: Iterable[LotSplit], opened_at=None):
    opened_at = opened_at or timezone.now()
    lots = list(lots)
    if not lots:
        raise ValidationError("No lots supplied to open.")
    opened: list[LotSplit] = []
    with transaction.atomic():
        parent = log_lifecycle_event(
            bean=lots[0].bean,
            kind=LifecycleKind.OPENED,
            at=opened_at,
            granularity=Granularity.BULK,
            summary=f"Opened {len(lots)} lots",
        )
        for lot in lots:
            result = open_lot(lot, opened_at, parent)
            opened.append(result)
    return opened

def create_lot(bean: Bean, vessel: Vessel | None, weight: Decimal, state: LotState,
               frozen_at=None, thawed_at=None, opened_at=None) -> LotSplit:
    lot: LotSplit = LotSplit(bean=bean, vessel=vessel,
                             stored_weight=weight, remaining_weight=weight)
    if not isinstance(state, LotState):
        raise ValidationError("State must be a valid LotState.")

    # Assign values
    lot.frozen_at = frozen_at
    lot.thawed_at = thawed_at
    lot.opened_at = opened_at

    # Validate the changes allow these validation rules
    validate_lot_state(lot, state)

    lot.save()
    return lot

def transfer_lot_assign_dates(transfer_target: LotTarget, original_lot: LotSplit, transferred_at):
    frozen_at, thawed_at, opened_at = None, None, None
    if transfer_target.state is LotState.FROZEN:
        if original_lot.frozen_at is None:
            frozen_at = transferred_at
        else:
            frozen_at = original_lot.frozen_at
    if transfer_target.state is LotState.THAWED:
        frozen_at = original_lot.frozen_at
        thawed_at = transferred_at
    if transfer_target.state is LotState.OPEN:
        frozen_at = original_lot.frozen_at
        thawed_at = original_lot.thawed_at
        if original_lot.opened_at is None:
            opened_at = transferred_at
        else:
            opened_at = original_lot.opened_at
    return frozen_at, thawed_at, opened_at

def transfer_lot(lot: LotSplit, targets: list[LotTarget], transferred_at=None) -> list[LotSplit]:
    # First Validate Steps:
    # Validate Lot 
    if lot.closed_at is not None:
        raise ValidationError("Cannot transfer from a closed lot.")
    if lot.frozen_at and lot.thawed_at is None:
        raise ValidationError("Must thaw the lot from frozen state before a transfer. Thaw or update thaw date first.")

    # Validate Targets
    if not targets:
        raise ValidationError("No valid transfer targets supplied. Please give valid targets")

    allowed_states = ALLOWED_TARGET_STATES[state_of(lot)]
    lots_errors = []
    lots_vessel_targets = []
    lots_weight_sum = Decimal("0")
    for t in targets:
        current_target_vessel = t.vessel if t.vessel else "original bag"

        if current_target_vessel in lots_vessel_targets:
            lots_errors.append("Two or more targets share a vessel.")
        lots_vessel_targets.append(current_target_vessel)

        if t.vessel is not None:
            busy = LotSplit.objects.filter(vessel=t.vessel, closed_at__isnull=True).exclude(pk=lot.pk).exists()
            if busy:
                lots_errors.append("A target vessel already holds an unclosed lot.")

        if t.weight is None or t.weight <= 0:
            lots_errors.append("One or more targets has an invalid weight.")

        if t.state not in allowed_states:
            lots_errors.append("One or more targets has an invalid lot state.")

        if t.weight is not None:
            lots_weight_sum += t.weight
    
    tolerance = Decimal("0.2") * len(targets)
    if abs(lots_weight_sum - lot.remaining_weight) > tolerance:
        lots_errors.append("Target weights must add up to the parent lot's remaining weight (within 0.2g per target).")

    if len(lots_vessel_targets) == 1:
        current_lot_vessel = lot.vessel if lot.vessel else "original bag"
        if lots_vessel_targets[0] == current_lot_vessel:
            lots_errors.append("Lot cannot have a transfer to the same vessel by itself. Must contain at least one new vessel.")

    if lots_errors:
        lots_errors_dedup = list(dict.fromkeys(lots_errors))
        raise ValidationError(lots_errors_dedup)

    # Break-out / Allocation
    transferred_at = transferred_at or timezone.now()
    result_lot: list[LotSplit] = []
    with transaction.atomic():
        # Update Source Lot - Runs first to avoid vessel clash
        leftover_weight = lot.remaining_weight - lots_weight_sum
        transfer_reason = CloseReason.objects.get(name=TRANSFER_REASON_NAME)
        close_lot(lot=lot, reason=transfer_reason, closed_at=transferred_at,leftover=leftover_weight, update_bean=False)

        # Create Targets
        for t in targets:
            t_frozen_at, t_thawed_at, t_opened_at = transfer_lot_assign_dates(t, lot, transferred_at)
            new_lot = create_lot(
                bean=lot.bean,
                vessel=t.vessel,
                weight=t.weight,
                state=t.state,
                frozen_at=t_frozen_at,
                thawed_at=t_thawed_at,
                opened_at=t_opened_at
            )
            result_lot.append(new_lot)
        
        # Run to preserve Non-done state over possible close_lot mishap on save
        mark_bean_finished_if_done(lot.bean)
    return result_lot

def merge_lots(sources: list[LotSplit], target: LotTarget, merged_at=None) -> LotSplit:
    # Validation
    lots_errors = []
    sum_weight = Decimal("0")

    if not sources or len(sources) < 2:
        lots_errors.append("Must have at least 2 sources to merge with.")

    if sources:
        for s in sources:
            if s.closed_at is not None:
                lots_errors.append("One or more merging lots are closed.")
            if s.frozen_at is not None and s.thawed_at is None:
                lots_errors.append("One or more merging lots is frozen but not thawed.")
            if s.frozen_at is None and s.thawed_at is not None:
                lots_errors.append("One or more merging lots is thawed but was never frozen.")
            if s.bean.short_id != sources[0].bean.short_id:
                lots_errors.append("All merging lots must belong to the same bean.")
            if s.frozen_at != sources[0].frozen_at or s.thawed_at != sources[0].thawed_at:
                lots_errors.append("Merging lots must share the same freeze and thaw dates.")
            sum_weight += s.remaining_weight

        source_ids = [s.pk for s in sources]
        if len(set(source_ids)) != len(source_ids):
            lots_errors.append("The same lot appears more than once.")

        if target.state is not LotState.OPEN:
            lots_errors.append("Target must have an OPEN target state.")
        if target.weight is None or target.weight <= 0:
            lots_errors.append("Target must have a weight above 0.")
        elif abs(target.weight - sum_weight) > Decimal("0.2") * len(sources):
            lots_errors.append("Target weight must match the sources' total remaining weight (within 0.2g per source).")
        if target.vessel is not None:
            busy = LotSplit.objects.filter(vessel=target.vessel, closed_at__isnull=True).exclude(pk__in=source_ids).exists()
            if busy:
                lots_errors.append("A target vessel already holds an unclosed lot.")

    if lots_errors:
        raise ValidationError(list(dict.fromkeys(lots_errors)))

    # Write phase
    merge_close_at = merged_at or timezone.now()
    with transaction.atomic():
        transfer_reason = CloseReason.objects.get(name=TRANSFER_REASON_NAME)

        base_source_lot = sources[0]
        for s in sources:
            if s.opened_at is not None:
                base_source_lot = s
                break
        new_opened = base_source_lot.opened_at or merge_close_at

        for s in sources:
            close_lot(lot=s, reason=transfer_reason, closed_at=merge_close_at, update_bean=False)

        new_lot = create_lot(
            bean=base_source_lot.bean,
            vessel=target.vessel,
            weight=target.weight,
            state=LotState.OPEN,
            frozen_at=base_source_lot.frozen_at,
            thawed_at=base_source_lot.thawed_at,
            opened_at=new_opened,
        )
        mark_bean_finished_if_done(base_source_lot.bean)
    return new_lot