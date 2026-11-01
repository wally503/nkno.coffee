from decimal import Decimal
from django.db.models import Exists, OuterRef, Prefetch
from django.utils import timezone
from rest_framework import serializers, viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from .models import Bean, LotSplit
from .lots_api import LotSplitSerializer
from .lifecycle import state_of

STATE_ORDER = ["open", "thawed", "frozen", "sealed"]


class BeanStockSerializer(serializers.ModelSerializer):
    lots = serializers.SerializerMethodField()
    total_stored = serializers.SerializerMethodField()
    total_remaining = serializers.SerializerMethodField()
    states = serializers.SerializerMethodField()
    open_days = serializers.SerializerMethodField()
    days_since_roast = serializers.SerializerMethodField()

    class Meta:
        model = Bean
        fields = [
            "id", "short_id", "name", "lots",
            "total_stored", "total_remaining", "states",
            "open_days", "days_since_roast",
        ]

    def get_lots(self, bean):
        return LotSplitSerializer(bean.stock_lots, many=True).data

    def get_total_stored(self, bean):
        total = Decimal("0")
        for lot in bean.stock_lots:
            total += lot.stored_weight
        return f"{total:.2f}"

    def get_total_remaining(self, bean):
        total = Decimal("0")
        for lot in bean.stock_lots:
            total += lot.remaining_weight
        return f"{total:.2f}"

    def get_states(self, bean):
        counts = {}
        for lot in bean.stock_lots:
            name = state_of(lot).value
            counts[name] = counts.get(name, 0) + 1
        parts = []
        for name in STATE_ORDER:
            if name in counts:
                parts.append(f"{counts[name]} {name}")
        return " · ".join(parts)

    def get_open_days(self, bean):
        oldest = None
        for lot in bean.stock_lots:
            if lot.opened_at is not None:
                if oldest is None or lot.opened_at < oldest:
                    oldest = lot.opened_at
        if oldest is None:
            return None
        return (timezone.now() - oldest).days

    def get_days_since_roast(self, bean):
        if bean.roast_date is None:
            return None
        return (timezone.localdate() - bean.roast_date).days


class BeanStockViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BeanStockSerializer
    lookup_field = "short_id"
    filter_backends = [OrderingFilter, SearchFilter]
    search_fields = ["name", "roaster__name"]
    ordering_fields = ["name", "roast_date"]
    ordering = ["name"]

    def get_queryset(self):
        has_unclosed = LotSplit.objects.filter(bean=OuterRef("pk"), closed_at__isnull=True)
        unclosed_lots = (
            LotSplit.objects
            .filter(closed_at__isnull=True)
            .select_related("vessel", "vessel__vessel_type")
            .order_by("id")
        )
        return (
            Bean.objects
            .annotate(has_unclosed_lot=Exists(has_unclosed))
            .filter(has_unclosed_lot=True)
            .prefetch_related(Prefetch("lotsplit_set", queryset=unclosed_lots, to_attr="stock_lots"))
        )