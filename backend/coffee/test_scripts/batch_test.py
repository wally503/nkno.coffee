from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
from django.core.exceptions import ValidationError
from coffee.models import LotSplit, Bean, Vessel, VesselType
from coffee.enums import LotState, LifecycleKind, Granularity
from coffee.lifecycle import create_lot, batch_freeze, batch_thaw, batch_open
from brew.models import BagLifecycleEvent

print()
print('##################################')
print('# Batch Freeze / Thaw / Open     #')
print('##################################')
print()

TYPE_NAME = "ZZ BATCH TYPE"
W = Decimal("50.00")

test_started = timezone.now()
stamp = timezone.now()   # every batch below is stamped with this time

def d(n):
    return stamp - timedelta(days=n)

def reset():
    BagLifecycleEvent.objects.filter(date__gte=test_started).delete()
    LotSplit.objects.filter(vessel__vessel_type__name=TYPE_NAME).delete()

def cleanup():
    BagLifecycleEvent.objects.filter(lot__vessel__vessel_type__name=TYPE_NAME).delete()
    reset()
    Vessel.objects.filter(vessel_type__name=TYPE_NAME).delete()
    VesselType.objects.filter(name=TYPE_NAME).delete()

cleanup()

# A bean with no open lots, so the 2-open cap starts from zero
bean = None
for b in Bean.objects.all():
    if not LotSplit.objects.filter(bean=b, opened_at__isnull=False, closed_at__isnull=True).exists():
        bean = b
        break
if bean is None:
    print("Need a bean with no open lots.")
    raise SystemExit

# Throwaway vessels
vt = VesselType.objects.create(name=TYPE_NAME, has_identifier=True, freezable=True)
A = Vessel.objects.create(vessel_type=vt, visual_identifier="ZZ-A")
B = Vessel.objects.create(vessel_type=vt, visual_identifier="ZZ-B")
C = Vessel.objects.create(vessel_type=vt, visual_identifier="ZZ-C")

# ---------------------------------------------------------------- helpers

def make(vessel, state=LotState.SEALED, **dates):
    return create_lot(bean=bean, vessel=vessel, weight=W, state=state, **dates)

def fresh(lot):
    return LotSplit.objects.get(pk=lot.pk)

def try_it(fn, *args):
    try:
        return fn(*args), None
    except ValidationError as e:
        return None, "; ".join(e.messages)

def check(label, ok, note=""):
    print(("PASS " if ok else "FAIL ") + label)
    if not ok and note:
        print("     " + note)

def logged_count():
    return BagLifecycleEvent.objects.filter(date__gte=test_started).count()

def none_opened(lots):
    for lot in lots:
        if fresh(lot).opened_at is not None:
            return False
    return True

def group_problem(kind, lots):
    """None if the batch left one bulk row with one granular child per lot."""
    rows = BagLifecycleEvent.objects.filter(bean=bean, date__gte=test_started)
    bulk = rows.filter(event_type=kind.value, granularity=Granularity.BULK.value,
                       parent__isnull=True)
    if bulk.count() != 1:
        seen = []
        for r in rows:
            seen.append((r.event_type, r.granularity, r.parent_id))
        return f"expected 1 bulk row, found {bulk.count()}; table has {seen}"
    parent = bulk.first()
    kids = BagLifecycleEvent.objects.filter(parent=parent)
    if kids.count() != len(lots):
        return f"expected {len(lots)} child rows, found {kids.count()}"
    lot_ids = []
    for lot in lots:
        lot_ids.append(lot.pk)
    for kid in kids:
        if kid.granularity != Granularity.GRANULAR.value:
            return "a child row is not granular"
        if kid.lot_id not in lot_ids:
            return "a child row points at the wrong lot"
    return None

# ------------------------------------------------------------ batch freeze

print("Batch freeze:")

reset()
l1, l2 = make(A), make(B)
result, error = try_it(batch_freeze, [l1, l2], stamp)

# print("rows in table:", BagLifecycleEvent.objects.count())
# for r in BagLifecycleEvent.objects.order_by("-id")[:5]:
#     print(r.id, r.event_type, r.granularity, r.parent_id, r.lot_id, r.bean_id, r.date)

check("freezes both lots", error is None, error)
check("both get the same freeze time",
      fresh(l1).frozen_at == stamp and fresh(l2).frozen_at == stamp)
problem = group_problem(LifecycleKind.FROZEN, [l1, l2])
check("one bulk row with a child per lot", problem is None, problem)

reset()
l1 = make(A)
l2 = make(B, LotState.FROZEN, frozen_at=d(2))
result, error = try_it(batch_freeze, [l1, l2], stamp)
check("refused when one lot is already frozen", error is not None, "was saved")
check("the other lot was left unfrozen (rolled back)", fresh(l1).frozen_at is None)
check("no rows were logged", logged_count() == 0)

reset()
result, error = try_it(batch_freeze, [], stamp)
check("empty list refused", error is not None, "was saved")

# -------------------------------------------------------------- batch thaw

print()
print("Batch thaw:")

reset()
l1 = make(A, LotState.FROZEN, frozen_at=d(3))
l2 = make(B, LotState.FROZEN, frozen_at=d(3))
result, error = try_it(batch_thaw, [l1, l2], stamp)
check("thaws both lots", error is None, error)
check("both get the same thaw time",
      fresh(l1).thawed_at == stamp and fresh(l2).thawed_at == stamp)
problem = group_problem(LifecycleKind.THAWED, [l1, l2])
check("one bulk row with a child per lot", problem is None, problem)

reset()
l1 = make(A, LotState.FROZEN, frozen_at=d(3))
l2 = make(B)   # never frozen
result, error = try_it(batch_thaw, [l1, l2], stamp)
check("refused when one lot was never frozen", error is not None, "was saved")
check("the other lot was left unthawed (rolled back)", fresh(l1).thawed_at is None)
check("no rows were logged", logged_count() == 0)

reset()
result, error = try_it(batch_thaw, [], stamp)
check("empty list refused", error is not None, "was saved")

# -------------------------------------------------------------- batch open

print()
print("Batch open:")

reset()
l1 = make(A)
l2 = make(B, LotState.THAWED, frozen_at=d(5), thawed_at=d(3))
result, error = try_it(batch_open, [l1, l2], stamp)
check("opens a sealed lot and a thawed lot together", error is None, error)
check("both get the same open time",
      fresh(l1).opened_at == stamp and fresh(l2).opened_at == stamp)
problem = group_problem(LifecycleKind.OPENED, [l1, l2])
check("one bulk row with a child per lot", problem is None, problem)

reset()
l1, l2, l3 = make(A), make(B), make(C)
result, error = try_it(batch_open, [l1, l2, l3], stamp)
check("refused when the third lot would exceed the cap", error is not None, "was saved")
check("none of the three was opened (rolled back)", none_opened([l1, l2, l3]))
check("no rows were logged", logged_count() == 0)

reset()
l1 = make(A)
l2 = make(B, LotState.FROZEN, frozen_at=d(2))
result, error = try_it(batch_open, [l1, l2], stamp)
check("refused when one lot is frozen and not thawed", error is not None, "was saved")
check("the other lot was left unopened (rolled back)", none_opened([l1]))
check("no rows were logged", logged_count() == 0)

reset()
result, error = try_it(batch_open, [], stamp)
check("empty list refused", error is not None, "was saved")

cleanup()
print()
print("Done.")