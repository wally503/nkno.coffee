
from coffee.enums import LifecycleKind, Granularity
from .models import BagLifecycleEvent
from coffee.models import Bean, LotSplit
from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError

def log_lifecycle_event(bean: Bean, kind: LifecycleKind, at, granularity: Granularity, lot: LotSplit | None = None, parent=None, summary="") -> BagLifecycleEvent:
    if not isinstance(kind, LifecycleKind):
        raise ValidationError("kind must be a LifecycleKind.")
    if not isinstance(granularity, Granularity):
        raise ValidationError("granularity must be a Granularity.")

    with transaction.atomic():
        event = BagLifecycleEvent(
            bean=bean,
            date=at,
            notes="",
            event_type=kind.value,
            granularity=granularity.value,
            lot=lot,
            parent=parent,
            summary=summary
        )
        event.save()
    return event

def log_lot_change(lot, kind, at, parent=None, detail=""):
    where = lot.vessel or "Original bag"
    words = {
        LifecycleKind.OPENED: "Opened",
        LifecycleKind.FROZEN: "Froze",
        LifecycleKind.THAWED: "Thawed",
        LifecycleKind.FINISHED: "Closed",
        LifecycleKind.TRANSFERRED: "Closed",
        LifecycleKind.MERGED: "Merged into",
        LifecycleKind.ADJUSTED: "Adjusted",
    }
    return log_lifecycle_event(
        bean=lot.bean, kind=kind, at=at,
        granularity=Granularity.GRANULAR,
        lot=lot, parent=parent,
        summary=f"{words[kind]} {where} {detail}".strip(),
    )

def log_group(bean, kind, at, summary):
    return log_lifecycle_event(
        bean=bean, kind=kind, at=at,
        granularity=Granularity.BULK,
        lot=None, summary=summary,
    )