
from coffee.enums import LifecycleKind, Granularity
from .models import BagLifecycleEvent
from coffee.models import Bean, LotSplit
from django.db import transaction
from django.utils import timezone

def log_lifecycle_event(bean: Bean, kind: LifecycleKind, at, granularity: Granularity, lot: LotSplit | None = None, parent=None, summary="") -> BagLifecycleEvent:
    if not isinstance(kind, LifecycleKind):
        raise ValidationError("kind must be a LifecycleKind.")
    if not isinstance(granularity, Granularity):
        raise ValidationError("granularity must be a Granularity.")

    with transaction.atomic():
        event = BagLifecycleEvent(
            bean=bean,
            date=at,
            #notes=None,
            event_type=kind.value,
            granularity=granularity.value,
            lot=lot,
            parent=parent,
            summary=summary
        )
    return event