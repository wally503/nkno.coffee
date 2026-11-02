from django.db.models import Exists, OuterRef
from rest_framework import serializers, viewsets

from .models import LotSplit, Vessel


class VesselOptionSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    freezable = serializers.BooleanField(source="vessel_type.freezable")

    class Meta:
        model = Vessel
        fields = ["id", "label", "freezable"]

    def get_label(self, vessel):
        return str(vessel)


class VesselViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = VesselOptionSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = (
            Vessel.objects
            .filter(is_active=True)
            .select_related("vessel_type")
            .order_by("vessel_type__name", "visual_identifier")
        )
        if self.request.query_params.get("free"):
            in_use = LotSplit.objects.filter(vessel=OuterRef("pk"), closed_at__isnull=True)
            queryset = queryset.annotate(in_use=Exists(in_use)).filter(in_use=False)
        return queryset