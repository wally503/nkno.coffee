from rest_framework import serializers, viewsets
from .models import BagLifecycleEvent


class LifecycleEventSerializer(serializers.ModelSerializer):
    bean_name = serializers.SerializerMethodField()
    lot_label = serializers.SerializerMethodField()

    class Meta:
        model = BagLifecycleEvent
        fields = [
            "id", "date", "bean", "bean_name", "event_type", "granularity",
            "parent", "lot", "lot_label", "summary", "notes",
        ]

    def get_bean_name(self, event):
        return event.bean.name

    def get_lot_label(self, event):
        if event.lot is None:
            return None
        return str(event.lot)


class LifecycleEventViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LifecycleEventSerializer
    pagination_class = None
    queryset = (
        BagLifecycleEvent.objects
        .select_related("bean", "lot", "lot__bean", "lot__vessel")
        .order_by("-date", "-id")
    )