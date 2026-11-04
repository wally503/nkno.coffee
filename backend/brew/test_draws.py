"""
Tests for coffee.draws: a brew taking grams out of a lot.

Run:  python manage.py test brew.test_draws
"""

from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from brew.models import (
    BagLifecycleEvent, BrewLog, Grinder, Kettle, LotBrewBridge, PouroverDetail, Scale,
)
from coffee.draws import (
    LotShortfall, adjust_draw, close_prompt_for, draw_from_lot, restore_draw, to_grams,
)
from coffee.enums import LifecycleKind, LotState
from coffee.lifecycle import close_lot, create_lot, freeze_lot, open_lot, thaw_lot
from brew.lifecycle_log import log_group
from coffee.models import Bean, CloseReason, Roaster, Vessel, VesselType


def make_bean(name="Test Bean"):
    roaster, _ = Roaster.objects.get_or_create(name="Test Roaster")
    return Bean.objects.create(name=name, roaster=roaster, caff_or_decaf="caffeinated")


def make_brew(bean, when=None):
    return BrewLog.objects.create(
        bean=bean, style="pourover", date=when or timezone.now(), extraction_rating=3,
    )


class DrawTests(TestCase):
    def setUp(self):
        self.bean = make_bean()
        self.now = timezone.now()
        self.opened = self.now - timedelta(days=2)
        self.lot = create_lot(
            self.bean, None, Decimal("100.00"), LotState.OPEN, opened_at=self.opened,
        )
        self.reason = CloseReason.objects.create(name="Finished (test)", carries_weight=False)

    def remaining(self, lot=None):
        lot = lot or self.lot
        lot.refresh_from_db()
        return lot.remaining_weight

    # -- rounding ---------------------------------------------------------

    def test_rounds_half_up_to_two_places(self):
        self.assertEqual(to_grams(Decimal("12.345")), Decimal("12.35"))
        self.assertEqual(to_grams(Decimal("12.344")), Decimal("12.34"))

    def test_dose_too_small_is_refused(self):
        with self.assertRaises(ValidationError):
            to_grams(Decimal("0.004"))

    # -- drawing ----------------------------------------------------------

    def test_draw_takes_grams_and_writes_bridge(self):
        brew = make_brew(self.bean)
        bridges = draw_from_lot(brew, self.lot, Decimal("12.500"))
        self.assertEqual(len(bridges), 1)
        self.assertEqual(self.remaining(), Decimal("87.50"))
        self.assertEqual(bridges[0].grams, Decimal("12.50"))
        self.assertFalse(bridges[0].is_closing)
        self.assertEqual(LotBrewBridge.objects.filter(brew=brew, lot=self.lot).count(), 1)

    def test_cannot_draw_more_than_remaining(self):
        brew = make_brew(self.bean)
        with self.assertRaises(ValidationError):
            draw_from_lot(brew, self.lot, Decimal("100.010"))
        self.assertEqual(self.remaining(), Decimal("100.00"))
        self.assertFalse(LotBrewBridge.objects.exists())

    def test_sealed_and_frozen_lots_are_refused(self):
        other = make_bean("Other Bean")
        sealed = create_lot(other, None, Decimal("50.00"), LotState.SEALED)
        with self.assertRaises(ValidationError):
            draw_from_lot(make_brew(other), sealed, Decimal("10"))
        freeze_lot(sealed, frozen_at=self.now - timedelta(days=1))
        with self.assertRaises(ValidationError):
            draw_from_lot(make_brew(other), sealed, Decimal("10"))

    def test_closed_lot_is_refused(self):
        close_lot(self.lot, self.reason)
        with self.assertRaises(ValidationError):
            draw_from_lot(make_brew(self.bean), self.lot, Decimal("10"))

    def test_thawed_lot_is_opened_at_the_brew_date(self):
        other = make_bean("Thaw Bean")
        frozen_at = self.now - timedelta(days=10)
        thawed_at = self.now - timedelta(days=3)
        lot = create_lot(other, None, Decimal("80.00"), LotState.THAWED,
                         frozen_at=frozen_at, thawed_at=thawed_at)
        brew_date = self.now - timedelta(days=1)
        draw_from_lot(make_brew(other, brew_date), lot, Decimal("15"))
        lot.refresh_from_db()
        self.assertEqual(lot.opened_at, brew_date)
        self.assertEqual(lot.remaining_weight, Decimal("65.00"))
        self.assertTrue(
            BagLifecycleEvent.objects.filter(lot=lot, event_type=LifecycleKind.OPENED.value).exists()
        )

    def test_thawed_lot_brew_before_thaw_is_refused(self):
        other = make_bean("Thaw Bean 2")
        lot = create_lot(other, None, Decimal("80.00"), LotState.THAWED,
                         frozen_at=self.now - timedelta(days=10), thawed_at=self.now - timedelta(days=3))
        with self.assertRaises(ValidationError):
            draw_from_lot(make_brew(other, self.now - timedelta(days=5)), lot, Decimal("15"))
        lot.refresh_from_db()
        self.assertIsNone(lot.opened_at)
        self.assertEqual(lot.remaining_weight, Decimal("80.00"))

    # -- correction -------------------------------------------------------

    def test_correction_sets_weight_first_and_logs_adjusted(self):
        brew = make_brew(self.bean)
        draw_from_lot(brew, self.lot, Decimal("10"), correct_remaining=Decimal("94.50"))
        self.assertEqual(self.remaining(), Decimal("84.50"))
        event = BagLifecycleEvent.objects.get(lot=self.lot, event_type=LifecycleKind.ADJUSTED.value)
        self.assertIn("100.00 → 94.50", event.summary)

    def test_correction_lets_you_brew_from_a_drifted_lot(self):
        self.lot.remaining_weight = Decimal("5.00")
        self.lot.save()
        brew = make_brew(self.bean)
        with self.assertRaises(ValidationError):
            draw_from_lot(brew, self.lot, Decimal("12.5"))
        draw_from_lot(brew, self.lot, Decimal("12.5"), correct_remaining=Decimal("40"))
        self.assertEqual(self.remaining(), Decimal("27.50"))

    def test_correction_above_stored_is_refused(self):
        with self.assertRaises(ValidationError):
            draw_from_lot(make_brew(self.bean), self.lot, Decimal("10"), correct_remaining=Decimal("150"))
        self.assertEqual(self.remaining(), Decimal("100.00"))

    def test_unchanged_correction_logs_nothing(self):
        draw_from_lot(make_brew(self.bean), self.lot, Decimal("10"), correct_remaining=Decimal("100"))
        self.assertFalse(
            BagLifecycleEvent.objects.filter(event_type=LifecycleKind.ADJUSTED.value).exists()
        )

    # -- editing ----------------------------------------------------------

    def test_edit_dose_applies_only_the_difference(self):
        brew = make_brew(self.bean)
        draw_from_lot(brew, self.lot, Decimal("12.5"))
        adjust_draw(brew, None, Decimal("15"))
        self.assertEqual(self.remaining(), Decimal("85.00"))
        adjust_draw(brew, None, Decimal("10"))
        self.assertEqual(self.remaining(), Decimal("90.00"))
        self.assertEqual(LotBrewBridge.objects.get(brew=brew).grams, Decimal("10.00"))

    def test_edit_without_dose_change_is_allowed_on_a_closed_lot(self):
        brew = make_brew(self.bean)
        draw_from_lot(brew, self.lot, Decimal("12.5"))
        close_lot(self.lot, self.reason)
        adjust_draw(brew, None, Decimal("12.5"))  # notes/rating edit: no error
        self.lot.refresh_from_db()
        self.assertEqual(self.lot.remaining_weight, Decimal("0.00"))

    def test_dose_change_on_a_closed_lot_is_refused(self):
        # Raising AND lowering the dose: lowering would otherwise "give back" grams to a closed lot.
        brew = make_brew(self.bean)
        draw_from_lot(brew, self.lot, Decimal("12.5"))
        close_lot(self.lot, self.reason)
        for new_dose in (Decimal("15"), Decimal("10")):
            with self.assertRaisesMessage(ValidationError, "closed lot"):
                adjust_draw(brew, None, new_dose)
        self.assertEqual(LotBrewBridge.objects.get(brew=brew).grams, Decimal("12.50"))
        self.lot.refresh_from_db()
        self.assertEqual(self.lot.remaining_weight, Decimal("0.00"))

    def test_switching_lots_moves_the_grams(self):
        # a second open lot on the same bean needs a vessel (one unclosed bag lot per bean)
        vt = VesselType.objects.create(name="Jar (test)")
        vessel = Vessel.objects.create(vessel_type=vt, visual_identifier="A")
        second = create_lot(self.bean, vessel, Decimal("60.00"), LotState.OPEN, opened_at=self.opened)

        brew = make_brew(self.bean)
        draw_from_lot(brew, self.lot, Decimal("12.5"))
        adjust_draw(brew, second, Decimal("12.5"))
        self.assertEqual(self.remaining(self.lot), Decimal("100.00"))
        self.assertEqual(self.remaining(second), Decimal("47.50"))
        self.assertEqual(LotBrewBridge.objects.get(brew=brew).lot_id, second.pk)

    def test_unlinked_legacy_brew_stays_unlinked(self):
        brew = make_brew(self.bean)  # no bridge row: made before lots
        adjust_draw(brew, None, Decimal("12.5"))
        self.assertFalse(LotBrewBridge.objects.exists())
        self.assertEqual(self.remaining(), Decimal("100.00"))

    # -- delete -----------------------------------------------------------

    def test_delete_restores_the_grams(self):
        brew = make_brew(self.bean)
        draw_from_lot(brew, self.lot, Decimal("12.5"))
        restore_draw(brew)
        self.assertEqual(self.remaining(), Decimal("100.00"))
        self.assertFalse(LotBrewBridge.objects.exists())

    def test_delete_is_refused_when_the_lot_is_closed(self):
        brew = make_brew(self.bean)
        draw_from_lot(brew, self.lot, Decimal("12.5"))
        close_lot(self.lot, self.reason)
        with self.assertRaisesMessage(ValidationError, "closed lot"):
            restore_draw(brew)
        self.assertTrue(LotBrewBridge.objects.filter(brew=brew).exists())

    # -- split brews (the dose is more than the lot holds) ------------------

    def make_second_lot(self, remaining="60.00", bean=None):
        vt, _ = VesselType.objects.get_or_create(name="Jar (test)")
        vessel = Vessel.objects.create(vessel_type=vt, visual_identifier=f"J{Vessel.objects.count()}")
        return create_lot(bean or self.bean, vessel, Decimal(remaining), LotState.OPEN,
                          opened_at=self.opened)

    def make_nearly_empty(self, grams="5.00"):
        self.lot.remaining_weight = Decimal(grams)
        self.lot.save()

    def finished_reason(self):
        reason, _ = CloseReason.objects.get_or_create(
            name="Finished", defaults={"carries_weight": False, "is_active": True})
        return reason

    def test_overdraw_without_a_second_lot_raises_shortfall_with_numbers(self):
        self.make_nearly_empty()
        with self.assertRaises(LotShortfall) as ctx:
            draw_from_lot(make_brew(self.bean), self.lot, Decimal("12.5"))
        self.assertEqual(ctx.exception.remaining, Decimal("5.00"))
        self.assertEqual(ctx.exception.needed, Decimal("12.50"))
        self.assertEqual(self.remaining(), Decimal("5.00"))
        self.assertFalse(LotBrewBridge.objects.exists())

    def test_split_drains_and_closes_the_first_lot_and_takes_the_rest_from_the_second(self):
        self.finished_reason()
        second = self.make_second_lot("60.00")
        self.make_nearly_empty("5.00")
        brew = make_brew(self.bean)
        bridges = draw_from_lot(brew, self.lot, Decimal("12.5"), split_lot=second)

        self.assertEqual([(b.lot_id, b.grams, b.is_closing) for b in bridges],
                         [(self.lot.pk, Decimal("5.00"), True), (second.pk, Decimal("7.50"), False)])
        self.lot.refresh_from_db()
        self.assertIsNotNone(self.lot.closed_at)
        self.assertEqual(self.lot.closed_at, brew.date)
        self.assertEqual(self.lot.close_reason.name, "Finished")
        self.assertEqual(self.lot.remaining_weight, Decimal("0.00"))
        self.assertIsNone(self.lot.leftover_weight)
        self.assertEqual(self.remaining(second), Decimal("52.50"))
        self.bean.refresh_from_db()
        self.assertFalse(self.bean.finished)          # the second lot is still open
        self.assertTrue(BagLifecycleEvent.objects.filter(
            lot=self.lot, event_type=LifecycleKind.FINISHED.value).exists())

    def test_split_is_ignored_when_the_dose_fits(self):
        second = self.make_second_lot("60.00")
        bridges = draw_from_lot(make_brew(self.bean), self.lot, Decimal("12.5"), split_lot=second)
        self.assertEqual(len(bridges), 1)
        self.assertEqual(self.remaining(second), Decimal("60.00"))
        self.lot.refresh_from_db()
        self.assertIsNone(self.lot.closed_at)

    def test_split_refusals_change_nothing(self):
        self.finished_reason()
        self.make_nearly_empty("5.00")
        other_bean_lot = self.make_second_lot("60.00", bean=make_bean("Other Bean"))
        too_small = self.make_second_lot("3.00")
        cases = {
            "same lot": self.lot,
            "other bean": other_bean_lot,
            "second lot too small": too_small,
        }
        for label, split in cases.items():
            with self.subTest(label), self.assertRaises(ValidationError):
                draw_from_lot(make_brew(self.bean), self.lot, Decimal("12.5"), split_lot=split)
            self.assertEqual(self.remaining(), Decimal("5.00"), label)
            self.lot.refresh_from_db()
            self.assertIsNone(self.lot.closed_at, label)
            self.assertFalse(LotBrewBridge.objects.exists(), label)
        self.assertEqual(self.remaining(too_small), Decimal("3.00"))

    def test_split_refused_when_the_first_lot_is_empty(self):
        self.finished_reason()
        second = self.make_second_lot("60.00")
        self.make_nearly_empty("0.00")
        with self.assertRaises(ValidationError):
            draw_from_lot(make_brew(self.bean), self.lot, Decimal("12.5"), split_lot=second)

    def test_split_needs_an_active_finished_reason_and_rolls_back(self):
        CloseReason.objects.filter(name="Finished").delete()
        second = self.make_second_lot("60.00")
        self.make_nearly_empty("5.00")
        with self.assertRaisesMessage(ValidationError, "Finished"):
            draw_from_lot(make_brew(self.bean), self.lot, Decimal("12.5"), split_lot=second)
        self.assertEqual(self.remaining(second), Decimal("60.00"))
        self.assertFalse(LotBrewBridge.objects.exists())

    def test_split_opens_a_thawed_second_lot_at_the_brew_date(self):
        self.finished_reason()
        vt, _ = VesselType.objects.get_or_create(name="Jar (test)")
        vessel = Vessel.objects.create(vessel_type=vt, visual_identifier="T1")
        thawed = create_lot(self.bean, vessel, Decimal("60.00"), LotState.THAWED,
                            frozen_at=self.now - timedelta(days=10), thawed_at=self.now - timedelta(days=3))
        self.make_nearly_empty("5.00")
        brew = make_brew(self.bean, self.now - timedelta(days=1))
        draw_from_lot(brew, self.lot, Decimal("12.5"), split_lot=thawed)
        thawed.refresh_from_db()
        self.assertEqual(thawed.opened_at, brew.date)

    def split_brew(self):
        self.finished_reason()
        second = self.make_second_lot("60.00")
        self.make_nearly_empty("5.00")
        brew = make_brew(self.bean)
        draw_from_lot(brew, self.lot, Decimal("12.5"), split_lot=second)
        return brew, second

    def test_editing_a_split_brews_dose_changes_only_the_open_lots_share(self):
        brew, second = self.split_brew()
        adjust_draw(brew, None, Decimal("15"))
        self.assertEqual(self.remaining(second), Decimal("50.00"))      # took 2.5 g more
        rows = {b.lot_id: b.grams for b in LotBrewBridge.objects.filter(brew=brew)}
        self.assertEqual(rows, {self.lot.pk: Decimal("5.00"), second.pk: Decimal("10.00")})
        adjust_draw(brew, None, Decimal("8"))
        self.assertEqual(self.remaining(second), Decimal("57.00"))      # gave 7 g back
        self.lot.refresh_from_db()
        self.assertEqual(self.lot.remaining_weight, Decimal("0.00"))    # the closed lot is untouched

    def test_split_brew_dose_cannot_go_below_what_the_closed_lot_supplied(self):
        brew, second = self.split_brew()
        for too_low in (Decimal("5"), Decimal("4")):
            with self.assertRaisesMessage(ValidationError, "can't go below"):
                adjust_draw(brew, None, too_low)
        self.assertEqual(self.remaining(second), Decimal("52.50"))

    def test_split_brew_unchanged_dose_is_a_no_op_and_lot_cannot_move(self):
        brew, second = self.split_brew()
        adjust_draw(brew, None, Decimal("12.5"))
        third = self.make_second_lot("40.00")
        with self.assertRaisesMessage(ValidationError, "can't be moved"):
            adjust_draw(brew, third, Decimal("12.5"))

    def test_split_brew_dose_change_refused_once_the_other_lot_is_closed_too(self):
        brew, second = self.split_brew()
        close_lot(second, self.reason)
        with self.assertRaisesMessage(ValidationError, "closed lot"):
            adjust_draw(brew, None, Decimal("15"))

    def test_deleting_a_split_brew_is_refused(self):
        brew, second = self.split_brew()
        with self.assertRaisesMessage(ValidationError, "closed lot"):
            restore_draw(brew)
        self.assertEqual(LotBrewBridge.objects.filter(brew=brew).count(), 2)
        self.assertEqual(self.remaining(second), Decimal("52.50"))

    def test_deleting_a_brew_across_two_open_lots_restores_both(self):
        # two rows but neither lot closed (e.g. created by an admin): restores each lot
        second = self.make_second_lot("60.00")
        brew = make_brew(self.bean)
        draw_from_lot(brew, self.lot, Decimal("10"))
        LotBrewBridge.objects.create(brew=brew, lot=second, grams=Decimal("4"))
        second.remaining_weight = Decimal("56.00"); second.save()
        restore_draw(brew)
        self.assertEqual(self.remaining(), Decimal("100.00"))
        self.assertEqual(self.remaining(second), Decimal("60.00"))
        self.assertFalse(LotBrewBridge.objects.exists())

    # -- close prompt + finishing --------------------------------------------

    def test_close_prompt_only_for_a_nearly_empty_open_lot(self):
        draw_from_lot(make_brew(self.bean), self.lot, Decimal("12.5"))
        self.lot.refresh_from_db()
        self.assertIsNone(close_prompt_for(self.lot))                    # 87.5 g left
        self.lot.remaining_weight = Decimal("10.00")
        self.assertEqual(close_prompt_for(self.lot), {
            "lot_id": self.lot.pk, "label": "Test Bean – Original bag", "remaining": "10.00"})
        self.lot.remaining_weight = Decimal("10.01")
        self.assertIsNone(close_prompt_for(self.lot))
        self.lot.remaining_weight = Decimal("0.00")
        self.lot.closed_at = timezone.now()
        self.assertIsNone(close_prompt_for(self.lot))                    # already closed

    def test_closing_the_last_lot_finishes_the_bean_with_one_finished_event(self):
        close_lot(self.lot, self.reason)
        self.bean.refresh_from_db()
        self.assertTrue(self.bean.finished)
        self.assertEqual(BagLifecycleEvent.objects.filter(
            bean=self.bean, event_type=LifecycleKind.FINISHED.value).count(), 1)


class ApiTestBase(TestCase):
    """Shared fixtures for the endpoint tests: a superuser client, a bean with one open lot."""

    def setUp(self):
        user = get_user_model().objects.create_superuser("admin", "a@example.com", "pw")
        self.client = APIClient()
        self.client.force_authenticate(user)
        self.bean = make_bean("API Bean")
        self.lot = create_lot(
            self.bean, None, Decimal("100.00"), LotState.OPEN,
            opened_at=timezone.now() - timedelta(days=2),
        )
        self.grinder = Grinder.objects.create(name="G", brand="B")
        self.scale = Scale.objects.create(name="S")
        self.kettle = Kettle.objects.create(name="K", brand="B")

    def payload(self, **overrides):
        brew_log = {
            "bean": self.bean.short_id,
            "date": timezone.now().isoformat(),
            "extraction_rating": 3,
            "notes": "",
            "tags": [],
            "style": "pourover",
            "lot": self.lot.pk,
        }
        brew_log.update(overrides.pop("brew_log", {}))
        body = {
            "brew_log": brew_log,
            "grind_rotations": 3, "grind_position": "2.00", "water_type": "distilled",
            "weight": "12.500", "filter_type": "classic", "filter_brand": "x",
            "filter_count": 1, "pre_wet": "wet", "dripper": "origami", "cup": "ceramic",
            "water": "200.0", "temp": "96.0", "stop_time": "03:00", "pour_events": [],
            "grinder": self.grinder.short_id, "scale": self.scale.short_id,
            "kettle": self.kettle.short_id,
        }
        body.update(overrides)
        return body



class BrewApiTests(ApiTestBase):
    """The same rules, through the pourover endpoint (serializer + transaction)."""

    def test_create_draws_from_the_lot(self):
        res = self.client.post("/api/brew/pourover/", self.payload(), format="json")
        self.assertEqual(res.status_code, 201, res.content)
        self.lot.refresh_from_db()
        self.assertEqual(self.lot.remaining_weight, Decimal("87.50"))

    def test_create_without_a_lot_uses_the_beans_only_drawable_lot(self):
        body = self.payload()
        del body["brew_log"]["lot"]
        res = self.client.post("/api/brew/pourover/", body, format="json")
        self.assertEqual(res.status_code, 201, res.content)
        self.lot.refresh_from_db()
        self.assertEqual(self.lot.remaining_weight, Decimal("87.50"))

    def test_create_without_a_lot_is_refused_when_there_are_several(self):
        vt = VesselType.objects.create(name="Jar (test)")
        vessel = Vessel.objects.create(vessel_type=vt, visual_identifier="A")
        create_lot(self.bean, vessel, Decimal("60.00"), LotState.OPEN,
                   opened_at=timezone.now() - timedelta(days=1))
        body = self.payload()
        del body["brew_log"]["lot"]
        res = self.client.post("/api/brew/pourover/", body, format="json")
        self.assertEqual(res.status_code, 400, res.content)
        self.assertIn("lot", res.json()["brew_log"])
        self.assertFalse(BrewLog.objects.exists())

    def test_create_without_a_lot_is_refused_when_none_are_drawable(self):
        close_lot(self.lot, CloseReason.objects.create(name="Done (test)", carries_weight=False))
        body = self.payload()
        del body["brew_log"]["lot"]
        res = self.client.post("/api/brew/pourover/", body, format="json")
        self.assertEqual(res.status_code, 400, res.content)
        self.assertFalse(BrewLog.objects.exists())

    def test_refused_draw_rolls_the_whole_brew_back(self):
        res = self.client.post("/api/brew/pourover/", self.payload(weight="150.000"), format="json")
        self.assertEqual(res.status_code, 400, res.content)
        self.assertFalse(BrewLog.objects.exists())
        self.assertFalse(PouroverDetail.objects.exists())
        self.lot.refresh_from_db()
        self.assertEqual(self.lot.remaining_weight, Decimal("100.00"))

    def test_lot_from_another_bean_is_refused(self):
        other = make_bean("Other")
        other_lot = create_lot(other, None, Decimal("50"), LotState.OPEN,
                               opened_at=timezone.now() - timedelta(days=1))
        res = self.client.post("/api/brew/pourover/",
                               self.payload(brew_log={"lot": other_lot.pk}), format="json")
        self.assertEqual(res.status_code, 400, res.content)
        self.assertFalse(BrewLog.objects.exists())

    def test_edit_dose_adjusts_the_lot(self):
        res = self.client.post("/api/brew/pourover/", self.payload(), format="json")
        self.assertEqual(res.status_code, 201, res.content)
        short_id = BrewLog.objects.get().short_id
        body = self.payload(weight="15.000")
        body["brew_log"].pop("lot")  # an edit that doesn't re-send the lot keeps it
        res = self.client.put(f"/api/brew/pourover/{short_id}/", body, format="json")
        self.assertEqual(res.status_code, 200, res.content)
        self.lot.refresh_from_db()
        self.assertEqual(self.lot.remaining_weight, Decimal("85.00"))

    def test_delete_restores_the_grams(self):
        self.client.post("/api/brew/pourover/", self.payload(), format="json")
        short_id = BrewLog.objects.get().short_id
        res = self.client.delete(f"/api/brew/brewlogs/{short_id}/")
        self.assertEqual(res.status_code, 204, res.content)
        self.lot.refresh_from_db()
        self.assertEqual(self.lot.remaining_weight, Decimal("100.00"))

    # -- over-draw, split, close prompt through the endpoint -----------------

    def second_lot(self, remaining="60.00"):
        vt, _ = VesselType.objects.get_or_create(name="Jar (test)")
        vessel = Vessel.objects.create(vessel_type=vt, visual_identifier="API")
        return create_lot(self.bean, vessel, Decimal(remaining), LotState.OPEN,
                          opened_at=timezone.now() - timedelta(days=1))

    def test_overdraw_returns_the_shortfall_numbers_and_creates_nothing(self):
        self.lot.remaining_weight = Decimal("5.00"); self.lot.save()
        res = self.client.post("/api/brew/pourover/", self.payload(), format="json")
        self.assertEqual(res.status_code, 400, res.content)
        body = res.json()["brew_log"]
        self.assertEqual(body["lot_shortfall"], {"remaining": "5.00", "needed": "12.50"})
        self.assertIn("lot", body)
        self.assertFalse(BrewLog.objects.exists())

    def test_split_brew_through_the_endpoint(self):
        CloseReason.objects.get_or_create(name="Finished", defaults={"carries_weight": False})
        second = self.second_lot()
        self.lot.remaining_weight = Decimal("5.00"); self.lot.save()
        res = self.client.post("/api/brew/pourover/",
                               self.payload(brew_log={"split_lot": second.pk}), format="json")
        self.assertEqual(res.status_code, 201, res.content)
        self.assertEqual(LotBrewBridge.objects.count(), 2)
        self.lot.refresh_from_db(); second.refresh_from_db()
        self.assertIsNotNone(self.lot.closed_at)
        self.assertEqual(second.remaining_weight, Decimal("52.50"))
        self.assertIsNone(res.json()["close_prompt"])

    def test_response_carries_a_close_prompt_when_the_lot_ends_nearly_empty(self):
        self.lot.remaining_weight = Decimal("20.00"); self.lot.save()
        res = self.client.post("/api/brew/pourover/", self.payload(), format="json")
        self.assertEqual(res.status_code, 201, res.content)
        self.assertEqual(res.json()["close_prompt"], {
            "lot_id": self.lot.pk, "label": "API Bean – Original bag", "remaining": "7.50"})

    def test_response_has_no_close_prompt_when_plenty_is_left(self):
        res = self.client.post("/api/brew/pourover/", self.payload(), format="json")
        self.assertIsNone(res.json()["close_prompt"])

    def test_edit_response_has_no_close_prompt(self):
        self.lot.remaining_weight = Decimal("20.00"); self.lot.save()
        self.client.post("/api/brew/pourover/", self.payload(), format="json")
        short_id = BrewLog.objects.get().short_id
        body = self.payload(weight="12.000")
        body["brew_log"].pop("lot")
        res = self.client.put(f"/api/brew/pourover/{short_id}/", body, format="json")
        self.assertEqual(res.status_code, 200, res.content)
        self.assertIsNone(res.json()["close_prompt"])


class LogListTests(ApiTestBase):
    def test_days_since_opened_comes_from_the_lot(self):
        self.client.post("/api/brew/pourover/", self.payload(), format="json")
        res = self.client.get("/api/brew/brewlogs/")
        self.assertEqual(res.status_code, 200, res.content)
        brew_rows = [r for r in res.json()["results"] if r["style"] == "pourover"]
        self.assertEqual(len(brew_rows), 1)
        self.assertEqual(brew_rows[0]["days_since_opened"], 2)


class DrawableLotsApiTests(ApiTestBase):
    def test_lists_open_and_thawed_lots_grouped_by_bean(self):
        thaw_bean = make_bean("A Thawed Bean")
        thawed = create_lot(thaw_bean, None, Decimal("40.00"), LotState.THAWED,
                            frozen_at=timezone.now() - timedelta(days=9),
                            thawed_at=timezone.now() - timedelta(days=2))
        sealed_bean = make_bean("Sealed Bean")
        create_lot(sealed_bean, None, Decimal("40.00"), LotState.SEALED)
        frozen_bean = make_bean("Frozen Bean")
        create_lot(frozen_bean, None, Decimal("40.00"), LotState.FROZEN,
                   frozen_at=timezone.now() - timedelta(days=1))
        closed_bean = make_bean("Closed Bean")
        closed = create_lot(closed_bean, None, Decimal("40.00"), LotState.OPEN,
                            opened_at=timezone.now() - timedelta(days=1))
        close_lot(closed, CloseReason.objects.create(name="Done (test)", carries_weight=False))

        res = self.client.get("/api/coffee/lots/drawable/")
        self.assertEqual(res.status_code, 200, res.content)
        rows = res.json()
        self.assertEqual([r["bean_name"] for r in rows], ["A Thawed Bean", "API Bean"])
        by_id = {r["id"]: r for r in rows}
        self.assertEqual(by_id[thawed.pk]["state"], "thawed")
        self.assertEqual(by_id[self.lot.pk]["state"], "open")
        self.assertEqual(by_id[self.lot.pk]["vessel_label"], "Original bag")
        self.assertEqual(by_id[self.lot.pk]["remaining_weight"], "100.00")
        self.assertEqual(by_id[self.lot.pk]["bean_short_id"], self.bean.short_id)

    def test_longest_open_lot_comes_first_within_a_bean(self):
        vt = VesselType.objects.create(name="Jar (test)")
        vessel = Vessel.objects.create(vessel_type=vt, visual_identifier="B")
        older = create_lot(self.bean, vessel, Decimal("30.00"), LotState.OPEN,
                           opened_at=timezone.now() - timedelta(days=9))
        rows = self.client.get("/api/coffee/lots/drawable/").json()
        self.assertEqual([r["id"] for r in rows], [older.pk, self.lot.pk])

    def test_brew_read_includes_the_lot(self):
        self.client.post("/api/brew/pourover/", self.payload(), format="json")
        short_id = BrewLog.objects.get().short_id
        res = self.client.get(f"/api/brew/pourover/{short_id}/")
        self.assertEqual(res.status_code, 200, res.content)
        self.assertEqual(res.json()["brew_log"]["lot"],
                         {"id": self.lot.pk, "vessel_label": "Original bag"})

    def test_brew_read_without_a_bridge_has_no_lot(self):
        self.client.post("/api/brew/pourover/", self.payload(), format="json")
        LotBrewBridge.objects.all().delete()   # as if made before lots existed
        short_id = BrewLog.objects.get().short_id
        res = self.client.get(f"/api/brew/pourover/{short_id}/")
        self.assertIsNone(res.json()["brew_log"]["lot"])


class LogLabelTests(ApiTestBase):
    """The brew log says 'Lot' for single-lot events and 'Bag' for group / pre-lot events."""

    def event_labels(self):
        res = self.client.get("/api/brew/brewlogs/")
        self.assertEqual(res.status_code, 200, res.content)
        return {r["style_display"] for r in res.json()["results"] if r["style"] == "bag_event"}

    def test_closing_a_lot_reads_lot_closed(self):
        close_lot(self.lot, CloseReason.objects.create(name="Done (test)", carries_weight=False))
        self.assertEqual(self.event_labels(), {"Lot Closed"})

    def test_other_single_lot_events_read_lot(self):
        other = make_bean("Cycle Bean")
        lot = create_lot(other, None, Decimal("50.00"), LotState.SEALED)
        freeze_lot(lot, frozen_at=timezone.now() - timedelta(days=3))
        thaw_lot(lot, thawed_at=timezone.now() - timedelta(days=2))
        open_lot(lot, opened_at=timezone.now() - timedelta(days=1))
        self.assertEqual(self.event_labels(), {"Lot Frozen", "Lot Thawed", "Lot Opened"})

    def test_a_group_event_reads_bag(self):
        log_group(self.bean, LifecycleKind.TRANSFERRED, timezone.now(), "Moved 2 lots")
        self.assertEqual(self.event_labels(), {"Bag Transferred"})

    def test_an_old_pre_lot_event_reads_bag(self):
        BagLifecycleEvent.objects.create(
            bean=self.bean, event_type=LifecycleKind.FINISHED.value, date=timezone.now())
        self.assertEqual(self.event_labels(), {"Bag Finished"})

    def test_rows_say_whether_they_are_lot_or_bag_level(self):
        close_lot(self.lot, CloseReason.objects.create(name="Done (test)", carries_weight=False))
        log_group(self.bean, LifecycleKind.TRANSFERRED, timezone.now(), "Moved 2 lots")
        BagLifecycleEvent.objects.create(
            bean=self.bean, event_type=LifecycleKind.OPENED.value, date=timezone.now())
        rows = self.client.get("/api/brew/brewlogs/").json()["results"]
        levels = {r["style_display"]: r["level"] for r in rows if r["style"] == "bag_event"}
        self.assertEqual(levels, {"Lot Closed": "lot", "Bag Transferred": "bag", "Bag Opened": "bag"})

    def test_children_of_a_group_read_closed_not_finished(self):
        parent = log_group(self.bean, LifecycleKind.TRANSFERRED, timezone.now(), "Moved 1 lot")
        BagLifecycleEvent.objects.create(
            bean=self.bean, lot=self.lot, parent=parent, granularity="granular",
            event_type=LifecycleKind.FINISHED.value, date=timezone.now(), summary="Closed Original bag")
        BagLifecycleEvent.objects.create(
            bean=self.bean, lot=self.lot, parent=parent, granularity="granular",
            event_type=LifecycleKind.OPENED.value, date=timezone.now(), summary="Opened Original bag")
        rows = self.client.get("/api/brew/brewlogs/").json()["results"]
        group = next(r for r in rows if r["style"] == "bag_event" and r["child_count"] == 2)
        self.assertEqual(sorted(c["event_type_display"] for c in group["children"]), ["Closed", "Opened"])
