from rest_framework import serializers, viewsets
from .models import LotSplit


class LotSplitSerializer(serializers.ModelSerializer):
    bean_name = serializers.SerializerMethodField()
    vessel_label = serializers.SerializerMethodField()
    close_reason_name = serializers.SerializerMethodField()
    state = serializers.SerializerMethodField()

    class Meta:
        model = LotSplit
        fields = [
            "id", "bean", "bean_name", "vessel", "vessel_label", "state",
            "stored_weight", "remaining_weight", "leftover_weight",
            "frozen_at", "thawed_at", "opened_at", "closed_at",
            "close_reason_name",
        ]

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