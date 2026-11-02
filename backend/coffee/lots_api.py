from rest_framework import serializers, viewsets
from .models import LotSplit
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from .lifecycle import thaw_lot, freeze_lot, open_lot

class LotSplitSerializer(serializers.ModelSerializer):
    bean_name = serializers.SerializerMethodField()
    vessel_label = serializers.SerializerMethodField()
    close_reason_name = serializers.SerializerMethodField()
    state = serializers.SerializerMethodField()
    age_days = serializers.SerializerMethodField()
    open_days = serializers.SerializerMethodField()

    class Meta:
        model = LotSplit
        fields = [
            "id", "bean", "bean_name", "vessel", "vessel_label", "state",
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

    @action(detail=True, methods=["post"])
    def thaw(self, request, pk=None):
        return self._run(thaw_lot)

    @action(detail=True, methods=["post"])
    def freeze(self, request, pk=None):
        return self._run(freeze_lot)

    @action(detail=True, methods=["post"])
    def open(self, request, pk=None):
        return self._run(open_lot)