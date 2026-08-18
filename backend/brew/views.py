# brew/views.py

from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from .models import (
    Grinder, Scale, Kettle,
    BrewLog,
    AeropressDetail,
    PouroverDetail,
    ColdBrewDetail,
)
from .serializers import (
    GrinderSerializer,
    ScaleSerializer,
    KettleSerializer,
    BrewLogSerializer,
    BrewLogListSerializer,
    AeropressDetailSerializer,
    PouroverDetailSerializer,
    ColdBrewDetailSerializer,
)


class CatalogViewSet(viewsets.ModelViewSet):
    lookup_field = 'short_id'
    filter_backends = [OrderingFilter, SearchFilter]


# ---------------------------------------------------------------------------
# Equipment lookups
# ---------------------------------------------------------------------------

class GrinderViewSet(CatalogViewSet):
    queryset = Grinder.objects.all()
    serializer_class = GrinderSerializer
    search_fields = ['name', 'brand']
    ordering_fields = ['name', 'brand']


class ScaleViewSet(CatalogViewSet):
    queryset = Scale.objects.all()
    serializer_class = ScaleSerializer
    search_fields = ['name']
    ordering_fields = ['name']


class KettleViewSet(CatalogViewSet):
    queryset = Kettle.objects.all()
    serializer_class = KettleSerializer
    search_fields = ['name', 'brand']
    ordering_fields = ['name', 'brand']


# ---------------------------------------------------------------------------
# BrewLog
# ---------------------------------------------------------------------------

class BrewLogViewSet(viewsets.ModelViewSet):
    queryset = BrewLog.objects.select_related('bean').all()
    lookup_field = 'short_id'
    filter_backends = [OrderingFilter, SearchFilter]
    search_fields = ['bean__name', 'notes']
    ordering_fields = ['date', 'extraction_rating', 'pull_number']

    def get_serializer_class(self):
        if self.action == 'list':
            return BrewLogListSerializer
        return BrewLogSerializer


# ---------------------------------------------------------------------------
# Style detail tables
# ---------------------------------------------------------------------------

class AeropressDetailViewSet(viewsets.ModelViewSet):
    queryset = AeropressDetail.objects.select_related('brew_log', 'grinder', 'scale', 'kettle').prefetch_related('hoffmann_events').all()
    filter_backends = [OrderingFilter, SearchFilter]

    def get_serializer_class(self):
        if self.action == 'list':
            return AeropressDetailListSerializer
        return AeropressDetailSerializer


class PouroverDetailViewSet(viewsets.ModelViewSet):
    queryset = PouroverDetail.objects.select_related('brew_log', 'grinder', 'scale', 'kettle').prefetch_related('pour_events').all()
    serializer_class = PouroverDetailSerializer
    filter_backends = [OrderingFilter, SearchFilter]


class ColdBrewDetailViewSet(viewsets.ModelViewSet):
    queryset = ColdBrewDetail.objects.select_related('brew_log', 'grinder', 'scale').all()
    serializer_class = ColdBrewDetailSerializer
    filter_backends = [OrderingFilter, SearchFilter]