from coffee.models import LotSplit, Bean, Vessel, VesselType, CloseReason
from coffee.lifecycle import  (freeze_lot, thaw_lot, create_lot, open_lot, close_lot, transfer_lot, merge_lots,
                              LotTarget)
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta
from django.core.exceptions import ValidationError
from coffee.enums import LotState, LifecycleKind

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
    except Exception as e:
        worked = False
        if worked != should_work:
            print(e)
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
    except Exception as e:
        ok = False
        if not ok:
            print(e)
        return ok

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



print()
print('##################################')
print('# Transfer and Merge Tests       #')
print('##################################')
print()

TYPE_NAME = "ZZ TEST TYPE"
W = Decimal("88.00")    # a whole lot
P1 = Decimal("40.00")   # merge source 1
P2 = Decimal("48.00")   # merge source 2 (P1 + P2 = W)

now = timezone.now()
def d(n):
    return now - timedelta(days=n)

def cleanup():
    LotSplit.objects.filter(vessel__vessel_type__name=TYPE_NAME).delete()
    Vessel.objects.filter(vessel_type__name=TYPE_NAME).delete()
    VesselType.objects.filter(name=TYPE_NAME).delete()

cleanup()

# A bean with no unclosed bag lot, and a close reason that isn't "Transferred"
bean = None
for b in Bean.objects.all():
    if not LotSplit.objects.filter(bean=b, vessel__isnull=True, closed_at__isnull=True).exists():
        bean = b
        break
reason = CloseReason.objects.filter(carries_weight=False, is_active=True).first()
if bean is None or reason is None:
    print("Need a bean with no unclosed bag lot, and a non-weight-carrying CloseReason.")
    raise SystemExit

other_bean = Bean.objects.exclude(pk=bean.pk).first()
finished_flags = {bean.pk: bean.finished}
if other_bean is not None:
    finished_flags[other_bean.pk] = other_bean.finished

# Throwaway vessels
vt = VesselType.objects.create(name=TYPE_NAME, has_identifier=True, freezable=True)
A = Vessel.objects.create(vessel_type=vt, visual_identifier="ZZ-A")
B = Vessel.objects.create(vessel_type=vt, visual_identifier="ZZ-B")
C = Vessel.objects.create(vessel_type=vt, visual_identifier="ZZ-C")

def make(vessel, state=LotState.SEALED, weight=W, the_bean=None, **dates):
    return create_lot(bean=the_bean or bean, vessel=vessel, weight=weight, state=state, **dates)

def tg(vessel, weight, state=LotState.OPEN):
    return LotTarget(vessel=vessel, weight=weight, state=state)

def closed_lot():
    lot = make(None)
    close_lot(lot, reason, update_bean=False)
    return lot

def twice():
    lot = make(B, weight=P1)
    return [lot, lot]

def run(label, expect_ok, setup, act, check=None):
    before = set(LotSplit.objects.values_list("pk", flat=True))
    ctx = setup()
    saved = False
    note = ""
    try:
        result = act(ctx)
        saved = True
        if check is not None:
            note = check(ctx, result) or ""
    except ValidationError as e:
        note = "; ".join(e.messages)
    if saved and not expect_ok:
        note = "was saved but should have been refused"
    passed = (saved == expect_ok) and not (saved and note)
    print(("PASS " if passed else "FAIL ") + label)
    if note:
        print("     " + note)
    LotSplit.objects.exclude(pk__in=before).delete()
    for pk, flag in finished_flags.items():
        Bean.objects.filter(pk=pk).update(finished=flag)

print("Transfer, should save:")
run("bag lot into an airscape", True,
    lambda: make(None),
    lambda lot: transfer_lot(lot, [tg(A, W)]),
    lambda lot, res: None if (lot.closed_at and len(res) == 1 and res[0].vessel == A and res[0].opened_at) else "source not closed, or target wrong")

run("bag lot split: airscape + bag partial", True,
    lambda: make(None),
    lambda lot: transfer_lot(lot, [tg(A, Decimal("60.00")), tg(None, Decimal("28.00"))]),
    lambda lot, res: None if (lot.closed_at and len(res) == 2) else "expected a closed source and two new lots")

run("open source: target keeps opened_at", True,
    lambda: make(B, LotState.OPEN, opened_at=d(3)),
    lambda lot: transfer_lot(lot, [tg(A, W)]),
    lambda lot, res: None if res[0].opened_at == lot.opened_at else "opened_at was changed")

print()
print("Transfer, should be refused:")
run("single target in the source's own vessel", False,
    lambda: make(B, LotState.OPEN, opened_at=d(1)),
    lambda lot: transfer_lot(lot, [tg(B, W)]))

run("two targets in the same vessel", False,
    lambda: make(None),
    lambda lot: transfer_lot(lot, [tg(A, Decimal("44.00")), tg(A, Decimal("44.00"))]))

run("targets add up to far less", False,
    lambda: make(None),
    lambda lot: transfer_lot(lot, [tg(A, Decimal("20.00"))]))

run("targets add up to far more", False,
    lambda: make(None),
    lambda lot: transfer_lot(lot, [tg(A, Decimal("120.00"))]))

run("no targets", False,
    lambda: make(None),
    lambda lot: transfer_lot(lot, []))

run("frozen source", False,
    lambda: make(B, LotState.FROZEN, frozen_at=d(2)),
    lambda lot: transfer_lot(lot, [tg(A, W)]))

run("closed source", False,
    closed_lot,
    lambda lot: transfer_lot(lot, [tg(A, W)]))

run("THAWED target (transfers always open)", False,
    lambda: make(None),
    lambda lot: transfer_lot(lot, [tg(A, W, LotState.THAWED)]))

run("open source with a FROZEN target", False,
    lambda: make(B, LotState.OPEN, opened_at=d(1)),
    lambda lot: transfer_lot(lot, [tg(A, W, LotState.FROZEN)]))

print()
print("Merge, should save:")
run("two sealed lots into an airscape", True,
    lambda: [make(B, weight=P1), make(C, weight=P2)],
    lambda srcs: merge_lots(srcs, tg(A, W)),
    lambda srcs, res: None if (all(s.closed_at for s in srcs) and res.vessel == A and res.stored_weight == W) else "sources not closed, or new lot wrong")

run("one open source: merged lot keeps its opened_at", True,
    lambda: [make(B, LotState.OPEN, weight=P1, opened_at=d(2)), make(C, weight=P2)],
    lambda srcs: merge_lots(srcs, tg(A, W)),
    lambda srcs, res: None if res.opened_at == srcs[0].opened_at else "opened_at is wrong")

run("matching freeze history carries over", True,
    lambda: [make(B, LotState.THAWED, weight=P1, frozen_at=d(5), thawed_at=d(3)),
             make(C, LotState.THAWED, weight=P2, frozen_at=d(5), thawed_at=d(3))],
    lambda srcs: merge_lots(srcs, tg(A, W)),
    lambda srcs, res: None if (res.frozen_at == d(5) and res.thawed_at == d(3)) else "freeze dates not carried over")

run("target reuses one of the sources' vessels", True,
    lambda: [make(B, weight=P1), make(C, weight=P2)],
    lambda srcs: merge_lots(srcs, tg(B, W)),
    lambda srcs, res: None if res.vessel == B else "new lot is in the wrong vessel")

print()
print("Merge, should be refused:")
run("only one source", False,
    lambda: [make(B, weight=P1)],
    lambda srcs: merge_lots(srcs, tg(A, P1)))

run("different freeze histories", False,
    lambda: [make(B, LotState.THAWED, weight=P1, frozen_at=d(5), thawed_at=d(3)), make(C, weight=P2)],
    lambda srcs: merge_lots(srcs, tg(A, W)))

run("same lot listed twice", False,
    twice,
    lambda srcs: merge_lots(srcs, tg(A, Decimal("80.00"))))

run("target state is not OPEN", False,
    lambda: [make(B, weight=P1), make(C, weight=P2)],
    lambda srcs: merge_lots(srcs, tg(A, W, LotState.SEALED)))

run("target weight doesn't match the sources", False,
    lambda: [make(B, weight=P1), make(C, weight=P2)],
    lambda srcs: merge_lots(srcs, tg(A, Decimal("50.00"))))

run("one source is closed", False,
    lambda: [closed_lot(), make(B, weight=P2)],
    lambda srcs: merge_lots(srcs, tg(A, P2)))

if other_bean is not None:
    run("sources from different beans", False,
        lambda: [make(B, weight=P1), make(C, weight=P2, the_bean=other_bean)],
        lambda srcs: merge_lots(srcs, tg(A, W)))

cleanup()
print()
print("Done.")