from rest_framework import serializers, viewsets
from .models import LotSplit, Vessel, CloseReason
from django.db.models import F, Q
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from .lifecycle import transfer_lot, merge_lots, LotTarget, thaw_lot, freeze_lot, open_lot, close_lot
from decimal import Decimal, InvalidOperation
from django.core.exceptions import ValidationError
from .enums import LotState
from django.utils.dateparse import parse_datetime

def _when_from_request(request):
    """Returns (datetime_or_None, error_or_None). None means 'use now'."""
    raw = request.data.get("date")
    if not raw:
        return None, None
    try:
        parsed = parse_datetime(str(raw))
    except ValueError:
        parsed = None
    if parsed is None:
        return None, "Enter a valid date and time."
    if timezone.is_naive(parsed):
        parsed = timezone.make_aware(parsed)
    if parsed > timezone.now():
        return None, "Date can't be in the future."
    return parsed, None

class LotSplitSerializer(serializers.ModelSerializer):
    bean_name = serializers.SerializerMethodField()
    vessel_label = serializers.SerializerMethodField()
    close_reason_name = serializers.SerializerMethodField()
    state = serializers.SerializerMethodField()
    age_days = serializers.SerializerMethodField()
    open_days = serializers.SerializerMethodField()
    bean_short_id = serializers.SerializerMethodField()
    earliest = serializers.SerializerMethodField()
    
    class Meta:
        model = LotSplit
        fields = [
            "id", "bean", "bean_name", "bean_short_id", "vessel", "vessel_label", "state",
            "stored_weight", "remaining_weight", "leftover_weight",
            "frozen_at", "thawed_at", "opened_at", "closed_at",
            "age_days", "open_days", "close_reason_name", "earliest",
        ]

    def get_age_days(self, lot):
        roast = lot.bean.roast_date
        if roast is None:
            return None
        if lot.frozen_at is not None and lot.thawed_at is None:
            return None   # still frozen
        now = timezone.now()
        total = (timezone.localdate() - roast).days
        frozen_days = 0
        if lot.frozen_at is not None and lot.thawed_at is not None:
            frozen_days = (lot.thawed_at - lot.frozen_at).days
        return total - frozen_days

    def get_open_days(self, lot):
        if lot.opened_at is None or lot.closed_at is not None:
            return None
        return (timezone.now() - lot.opened_at).days

    def get_bean_name(self, lot):
        return lot.bean.name

    def get_bean_short_id(self, lot):
        return lot.bean.short_id

    def get_vessel_label(self, lot):
        if lot.vessel is None:
            return "Original bag"
        return str(lot.vessel)

    def get_close_reason_name(self, lot):
        if lot.close_reason is None:
            return None
        return lot.close_reason.name

    def get_state(self, lot):
        if lot.closed_at:
            return "closed"
        if lot.opened_at:
            return "open"
        if lot.thawed_at:
            return "thawed"
        if lot.frozen_at:
            return "frozen"
        return "sealed"

    def get_earliest(self, obj):
        result = {}
        for kind in ("freeze", "thaw", "open", "close"):
            at, reason = obj.earliest_for(kind)
            result[kind] = None if at is None else {"at": at, "reason": reason}
        return result

class DrawableLotSerializer(serializers.ModelSerializer):
    """Lean shape for the brew form's lot picker."""
    bean_name = serializers.CharField(source="bean.name", read_only=True)
    bean_short_id = serializers.CharField(source="bean.short_id", read_only=True)
    vessel_label = serializers.SerializerMethodField()
    state = serializers.SerializerMethodField()

    class Meta:
        model = LotSplit
        fields = ["id", "bean_name", "bean_short_id", "vessel_label", "state", "remaining_weight"]

    def get_vessel_label(self, lot):
        return "Original bag" if lot.vessel is None else str(lot.vessel)

    def get_state(self, lot):
        return "open" if lot.opened_at else "thawed"


class LotSplitViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LotSplitSerializer
    pagination_class = None
    queryset = (
        LotSplit.objects
        .select_related("bean", "vessel", "vessel__vessel_type", "close_reason")
        .order_by("-id")
    )

    def _run(self, fn, **kwargs):
        lot = self.get_object()
        try:
            fn(lot, **kwargs)
        except ValidationError as e:
            return Response({"errors": e.messages}, status=400)
        lot.refresh_from_db()
        return Response(LotSplitSerializer(lot).data)

    @action(detail=False, methods=["get"])
    def drawable(self, request):
        """
        Lots a brew can draw from: open, or thawed (a thawed lot is opened when the brew
        is saved). Grouped by bean name, longest-open first within a bean.
        """
        lots = (
            self.get_queryset()
            .filter(closed_at__isnull=True)
            .filter(Q(opened_at__isnull=False) | Q(thawed_at__isnull=False))
            .order_by("bean__name", F("opened_at").asc(nulls_last=True), "id")
        )
        return Response(DrawableLotSerializer(lots, many=True).data)

    @action(detail=False, methods=["post"])
    def rearrange(self, request):
        source_ids = request.data.get("sources") or []
        target_data = request.data.get("targets") or []

        sources = list(LotSplit.objects.select_related("bean", "vessel").filter(pk__in=source_ids))
        if not source_ids or len(sources) != len(set(source_ids)):
            return Response({"errors": ["Pick at least one source lot."]}, status=400)
        if not target_data:
            return Response({"errors": ["Pick at least one target vessel."]}, status=400)

        problems = []
        targets = []
        for index, item in enumerate(target_data, start=1):
            vessel = None
            if item.get("vessel") is not None:
                vessel = Vessel.objects.filter(pk=item["vessel"]).first()
                if vessel is None:
                    problems.append(f"Target {index}: vessel not found.")
            try:
                weight = Decimal(str(item.get("weight")))
            except InvalidOperation:
                problems.append(f"Target {index}: enter a weight.")
                continue
            try:
                state = LotState(item.get("state"))
            except ValueError:
                problems.append(f"Target {index}: unknown state.")
                continue
            targets.append(LotTarget(vessel=vessel, weight=weight, state=state))
        if problems:
            return Response({"errors": problems}, status=400)

        try:
            if len(sources) == 1:
                created = transfer_lot(sources[0], targets)
            elif len(targets) == 1:
                created = [merge_lots(sources, targets[0])]
            else:
                return Response(
                    {"errors": ["Merging several lots into several targets isn't supported. Merge first, then transfer."]},
                    status=400,
                )
        except ValidationError as e:
            return Response({"errors": e.messages}, status=400)

        return Response(LotSplitSerializer(created, many=True).data, status=201)

    @action(detail=True, methods=["post"])
    def thaw(self, request, pk=None):
        when, error = _when_from_request(request)
        if error:
            return Response({"errors": [error]}, status=400)
        return self._run(thaw_lot, thawed_at=when)

    @action(detail=True, methods=["post"])
    def freeze(self, request, pk=None):
        when, error = _when_from_request(request)
        if error:
            return Response({"errors": [error]}, status=400)
        return self._run(freeze_lot, frozen_at=when)

    @action(detail=True, methods=["post"])
    def open(self, request, pk=None):
        when, error = _when_from_request(request)
        if error:
            return Response({"errors": [error]}, status=400)
        return self._run(open_lot, opened_at=when)

    @action(detail=False, methods=["get"], url_path="close-reasons")
    def close_reasons(self, request):
        reasons = CloseReason.objects.filter(is_active=True, carries_weight=False).order_by("name")
        return Response([{"id": r.id, "name": r.name} for r in reasons])

    @action(detail=True, methods=["post"])
    def close(self, request, pk=None):
        when, error = _when_from_request(request)
        if error:
            return Response({"errors": [error]}, status=400)
        reason = CloseReason.objects.filter(
            pk=request.data.get("reason"), is_active=True, carries_weight=False
        ).first()
        if reason is None:
            return Response({"errors": ["Pick a close reason."]}, status=400)
        return self._run(close_lot, reason=reason, closed_at=when)