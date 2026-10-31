from coffee.models import LotSplit, Bean, CloseReason
from coffee.lifecycle import freeze_lot, thaw_lot, open_lot, close_lot, LotState, create_lot
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta
from django.core.exceptions import ValidationError

FAUX_WEIGHT = Decimal("123.45") 

print('')
print('#########################################################')
print('# Testing General Validations on Lot Allocation Methods #')
print('#########################################################')
print('')

reason = CloseReason.objects.filter(carries_weight=False, is_active=True).first()

bean = None
for b in Bean.objects.all():
    if not LotSplit.objects.filter(bean=b, vessel__isnull=True, closed_at__isnull=True).exists():
        bean = b
        break

if bean is None or reason is None:
    print("Need a bean with no unclosed bag lot, and a non-weight-carrying CloseReason.")
    raise SystemExit

lot = LotSplit.objects.create(bean=bean, stored_weight=100, remaining_weight=100)

def step(label, fn, should_work):
    try:
        fn()
        worked = True
    except Exception:
        worked = False
    print(("PASS " if worked == should_work else "FAIL ") + label)

try:
    step("freeze", lambda: freeze_lot(lot), True)
    step("freeze again", lambda: freeze_lot(lot), False)
    step("open while frozen", lambda: open_lot(lot), False)
    step("thaw", lambda: thaw_lot(lot), True)
    step("thaw again", lambda: thaw_lot(lot), False)
    step("freeze after thaw", lambda: freeze_lot(lot), False)
    step("open", lambda: open_lot(lot), True)
    step("open again", lambda: open_lot(lot), False)
    step("close", lambda: close_lot(lot, reason), True)
    print(("PASS " if lot.leftover_weight == 100 and lot.remaining_weight == 0 else "FAIL ") + "close weights")
    step("close again", lambda: close_lot(lot, reason), False)
    step("freeze closed", lambda: freeze_lot(lot), False)
    step("thaw closed", lambda: thaw_lot(lot), False)
finally:
    lot.delete()



print('')
print('####################################################')
print('# Testing Three Differnet Open Lots on Single Bean #')
print('####################################################')
print('')



def works(fn, lot):
    try:
        fn(lot)
        return True
    except Exception:
        return False

bean = Bean.objects.first()
LotSplit.objects.filter(bean=bean, stored_weight=FAUX_WEIGHT).delete()

free = []
for vessel in Vessel.objects.filter(is_active=True):
    in_use = LotSplit.objects.filter(vessel=vessel, closed_at__isnull=True).exists()
    if not in_use:
        free.append(vessel)

if len(free) < 3:
    print("Need 3 free, active vessels.")
    raise SystemExit

lots = []
for vessel in free[:3]:
    lot = LotSplit.objects.create(bean=bean, vessel=vessel, stored_weight=FAUX_WEIGHT, remaining_weight=FAUX_WEIGHT)
    lots.append(lot)

print("PASS" if works(open_lot, lots[0]) else "FAIL", "open first lot")
print("PASS" if works(open_lot, lots[1]) else "FAIL", "open second lot")
print("PASS" if not works(open_lot, lots[2]) else "FAIL", "third lot refused")

LotSplit.objects.filter(bean=bean, stored_weight=FAUX_WEIGHT).delete()




print('')
print('################################################')
print('# Testing Lot Validation Breaks on Create Lot  #')
print('################################################')
print('')

# Take first bean for templating
bean = Bean.objects.first()

# template dates for insuring no date mismatch on validations
now = timezone.now()
three_days_ago = now - timedelta(days=3)
two_days_ago = now - timedelta(days=2)

# fetch a free open vessel for test
free_vessel = None
for vessel in Vessel.objects.filter(is_active=True, vessel_type__freezable=True):
    in_use = LotSplit.objects.filter(vessel=vessel, closed_at__isnull=True).exists()
    if not in_use:
        free_vessel = vessel
        break
if free_vessel is None:
    print("No free active vessel for the test.")
    raise SystemExit

def create_lot_check(label, expect_ok, **kwargs):
    lot = None
    try:
        lot = create_lot(**kwargs)
        ok = True
    except ValidationError as e:
        ok = False
        if ok != expect_ok:
            print(e)
    print(("PASS " if ok == expect_ok else "FAIL ") + label)
    if lot is not None:
        lot.delete()

print('Tests for Bad Parameters:')
print()

# frozen fail test
create_lot_check(
    label="frozen create_lot with bad params",
    expect_ok=False,
    bean=bean, 
    weight=FAUX_WEIGHT,
    vessel=free_vessel,
    frozen_at=two_days_ago,
    thawed_at=now,
    state = LotState.FROZEN)

# thawed fail test 
create_lot_check(
    label="thawed create_lot with bad params",
    expect_ok=False,
    bean=bean, 
    weight=FAUX_WEIGHT,
    vessel=free_vessel,
    frozen_at=three_days_ago,
    thawed_at=two_days_ago,
    opened_at=now,
    state = LotState.THAWED)

# sealed fail test 
create_lot_check(
    label="sealed create_lot with bad params",
    expect_ok=False,
    bean=bean, 
    weight=FAUX_WEIGHT,
    vessel=free_vessel,
    frozen_at=three_days_ago,
    thawed_at=two_days_ago,
    opened_at=now,
    state = LotState.SEALED)

# junk state passed in fail test 
create_lot_check(
    label="junk state passed to create_lot",
    expect_ok=False,
    bean=bean, 
    weight=FAUX_WEIGHT,
    vessel=free_vessel,
    frozen_at=three_days_ago,
    thawed_at=two_days_ago,
    opened_at=now,
    state = "junk")

# open state only frozen fail test
create_lot_check(
    label="frozen, no thaw passed to open create_lot",
    expect_ok=False,
    bean=bean, 
    weight=FAUX_WEIGHT,
    vessel=free_vessel,
    frozen_at=three_days_ago,
    opened_at=now,
    state = LotState.OPEN)

# open state only thaw fail test
create_lot_check(
    label="thaw, no frozen passed to open create_lot",
    expect_ok=False,
    bean=bean, 
    weight=FAUX_WEIGHT,
    vessel=free_vessel,
    thawed_at=two_days_ago,
    opened_at=now,
    state = LotState.OPEN)

# frozen missing frozen_at fail test
create_lot_check(
    label="frozen create_lot missing frozen_at",
    expect_ok=False,
    bean=bean,
    weight=FAUX_WEIGHT,
    vessel=free_vessel,
    state = LotState.FROZEN)

# thawed missing thawed_at fail test
create_lot_check(
    label="thawed create_lot missing thawed_at",
    expect_ok=False,
    bean=bean,
    weight=FAUX_WEIGHT,
    vessel=free_vessel,
    frozen_at=three_days_ago,
    state = LotState.THAWED)

# open missing opened_at fail test
create_lot_check(
    label="open create_lot missing opened_at",
    expect_ok=False,
    bean=bean,
    weight=FAUX_WEIGHT,
    vessel=free_vessel,
    frozen_at=three_days_ago,
    thawed_at=two_days_ago,
    state = LotState.OPEN)

print()
print('Tests for Good Parameters:')
print()

# frozen good test
create_lot_check(
    label="good frozen create_lot",
    expect_ok=True,
    bean=bean, 
    weight=FAUX_WEIGHT,
    vessel=free_vessel,
    frozen_at=two_days_ago,
    state = LotState.FROZEN)

# thawed good test 
create_lot_check(
    label="good thawed create_lot",
    expect_ok=True,
    bean=bean, 
    weight=FAUX_WEIGHT,
    vessel=free_vessel,
    frozen_at=three_days_ago,
    thawed_at=two_days_ago,
    state = LotState.THAWED)

# sealed good test 
create_lot_check(
    label="good sealed create_lot",
    expect_ok=True,
    bean=bean, 
    weight=FAUX_WEIGHT,
    vessel=free_vessel,
    state = LotState.SEALED)

# open good test - no freeze/thaw 
create_lot_check(
    label="good open create_lot with neither frozen/thawed assigned",
    expect_ok=True,
    bean=bean, 
    weight=FAUX_WEIGHT,
    vessel=free_vessel,
    opened_at=now,
    state = LotState.OPEN)

# open good test - freeze/thaw 
create_lot_check(
    label="good open create_lot with both frozen/thawed assigned",
    expect_ok=True,
    bean=bean, 
    weight=FAUX_WEIGHT,
    vessel=free_vessel,
    frozen_at=three_days_ago,
    thawed_at=two_days_ago,
    opened_at=now,
    state = LotState.OPEN)