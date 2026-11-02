from rest_framework import serializers, viewsets
from .models import LotSplit, Vessel
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from .lifecycle import transfer_lot, merge_lots, LotTarget
from decimal import Decimal, InvalidOperation
from django.core.exceptions import ValidationError
from .enums import LotState

class LotSplitSerializer(serializers.ModelSerializer):
    bean_name = serializers.SerializerMethodField()
    vessel_label = serializers.SerializerMethodField()
    close_reason_name = serializers.SerializerMethodField()
    state = serializers.SerializerMethodField()
    age_days = serializers.SerializerMethodField()
    open_days = serializers.SerializerMethodField()
    bean_short_id = serializers.SerializerMethodField()

    class Meta:
        model = LotSplit
        fields = [
            "id", "bean", "bean_name", "bean_short_id", "vessel", "vessel_label", "state",
            "stored_weight", "remaining_weight", "leftover_weight",
            "frozen_at", "thawed_at", "opened_at", "closed_at",
            "age_days", "open_days", "close_reason_name", 
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


class LotSplitViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LotSplitSerializer
    pagination_class = None
    queryset = (
        LotSplit.objects
        .select_related("bean", "vessel", "vessel__vessel_type", "close_reason")
        .order_by("-id")
    )

    def _run(self, fn):
        lot = self.get_object()
        try:
            fn(lot)
        except ValidationError as e:
            return Response({"errors": e.messages}, status=400)
        lot.refresh_from_db()
        return Response(LotSplitSerializer(lot).data)

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
        return self._run(thaw_lot)

    @action(detail=True, methods=["post"])
    def freeze(self, request, pk=None):
        return self._run(freeze_lot)

    @action(detail=True, methods=["post"])
    def open(self, request, pk=None):
        return self._run(open_lot)