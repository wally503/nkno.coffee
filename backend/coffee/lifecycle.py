from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
from .models import LotSplit, Bean, CloseReason
from collections.abc import Iterable
from enum import Enum

class LotState(Enum):
    SEALED = "sealed"
    FROZEN = "frozen"
    THAWED = "thawed"
    OPEN = "open"

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

def lot_attr_val(lot: LotSplit, state: LotState):
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

def open_lot(lot: LotSplit, opened_at=None):
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
        return lot

def batch_open(lots: Iterable[LotSplit], opened_at=None):
    opened_at = opened_at or timezone.now()
    opened: list[LotSplit] = []
    with transaction.atomic():
        for lot in lots:
            result = open_lot(lot, opened_at)
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
    lot_attr_val(lot, state)

    lot.save()
    return lot

