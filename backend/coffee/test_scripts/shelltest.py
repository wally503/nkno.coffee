from datetime import timedelta
from django.db import IntegrityError
from django.utils import timezone as tz
from coffee.models import LotSplit, Bean, CloseReason

now = tz.now()
d = lambda n: now - timedelta(days=n)
reason = CloseReason.objects.first()

bean = None
for b in Bean.objects.all():
    if not LotSplit.objects.filter(bean=b, vessel__isnull=True, closed_at__isnull=True).exists():
        bean = b
        break

if bean is None or reason is None:
    print("Need a bean with no unclosed bag lot, and at least one CloseReason.")
    raise SystemExit

def attempt(**kw):
    kw.setdefault("bean", bean)
    kw.setdefault("stored_weight", 100)
    kw.setdefault("remaining_weight", 100)
    try:
        obj = LotSplit.objects.create(**kw)
        obj.delete()
        return True
    except Exception:
        return False

cases = [
    ("plain lot", {}, True),
    ("used-up lot", dict(remaining_weight=0), True),
    ("remaining above stored", dict(remaining_weight=150), False),
    ("negative remaining", dict(remaining_weight=-1), False),
    ("zero stored", dict(stored_weight=0, remaining_weight=0), False),
    ("thaw with no freeze", dict(thawed_at=now), False),
    ("thaw before freeze", dict(frozen_at=now, thawed_at=d(1)), False),
    ("frozen, thawed, opened", dict(frozen_at=d(3), thawed_at=d(2), opened_at=now), True),
    ("opened while frozen", dict(frozen_at=d(1), opened_at=now), False),
    ("close with no reason", dict(closed_at=now), False),
    ("reason with no close", dict(close_reason=reason), False),
    ("closed, never opened", dict(closed_at=now, close_reason=reason), True),
    ("close before open", dict(opened_at=now, closed_at=d(1), close_reason=reason), False),
    ("close while frozen", dict(frozen_at=d(1), closed_at=now, close_reason=reason), True),
    ("thaw and open same instant", dict(frozen_at=d(1), thawed_at=now, opened_at=now), True),
]

for label, kw, expect in cases:
    got = attempt(**kw)
    print(("PASS " if got == expect else "FAIL ") + label)

try:
    objs = LotSplit.objects.bulk_create([LotSplit(bean=bean, stored_weight=100, remaining_weight=150)])
    print("FAIL bulk bypass (weight constraint not in the database)")
    LotSplit.objects.filter(bean=bean, remaining_weight=150).delete()
except IntegrityError:
    print("PASS bulk bypass refused by the database")
