# brew/views.py

from rest_framework import viewsets
from django.db.models import Q
from .pagination import DynamicPageSizePagination
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from .models import *
from .serializers import *
from .permissions import SuperUserDestroyMixin
from datetime import timedelta

class CatalogViewSet(ListModelMixin, RetrieveModelMixin, viewsets.GenericViewSet):
    lookup_field = 'short_id'
    filter_backends = [OrderingFilter, SearchFilter]

# ---------------------------------------------------------------------------
# Tiebreaker for open/close events
# ---------------------------------------------------------------------------

TIEBREAK_OFFSET = {
    'bag_event': timedelta(microseconds=-1),
}

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

class BrewLogViewSet(SuperUserDestroyMixin, viewsets.ModelViewSet):
    queryset = BrewLog.objects.select_related('bean').all()
    lookup_field = 'short_id'
    filter_backends = [OrderingFilter, SearchFilter]
    search_fields = ['bean__name', 'notes']
    ordering_fields = ['date', 'extraction_rating', 'pull_number']
    pagination_class = DynamicPageSizePagination

    def get_serializer_class(self):
        if self.action == 'list':
            return BrewLogListSerializer
        return BrewLogSerializer



    def list(self, request, *args, **kwargs):
        search = request.query_params.get('search', '') or ''
        ordering = request.query_params.get('ordering', '') or '-date'
        bean = request.query_params.get('bean_short_id')

        brew_qs = self.filter_queryset(self.get_queryset())

        bag_qs = BagLifecycleEvent.objects.select_related('bean').all()
        if bean:
            bag_qs = bag_qs.filter(bean__short_id=bean)
        if search:
            bag_qs = bag_qs.filter(
                Q(bean__name__icontains=search) | Q(notes__icontains=search)
            )

        combined = [self._brew_log_row(b) for b in brew_qs] + \
                [self._bag_event_row(e) for e in bag_qs]

        def sort_key(row):
            offset = TIEBREAK_OFFSET.get(row['style'], timedelta(0))
            return row['date'] + offset

        combined.sort(key=sort_key, reverse=ordering.startswith('-'))

        page = self.paginate_queryset(combined)
        if page is not None:
            return self.get_paginated_response(page)
        return Response(combined)

    def get_queryset(self):
        queryset = super().get_queryset()
        bean = self.request.query_params.get('bean_short_id')
        if bean:
            queryset = queryset.filter(bean__short_id=bean)
        return queryset
    

    def _brew_log_row(self, brew_log):
        detail = getattr(brew_log, f'{brew_log.style}_detail', None)
        return {
            'short_id': brew_log.short_id,
            'bean_name': brew_log.bean.name if brew_log.bean else '-',
            'bean_short_id': brew_log.bean.short_id if brew_log.bean else '-',
            'style': brew_log.style,
            'style_display': brew_log.get_style_display(),
            'date': brew_log.date,
            'extraction_rating': brew_log.extraction_rating,
            'pull_number': brew_log.pull_number,
            'detail_id': detail.id if detail else None,
            'days_since_opened': brew_log.days_since_opened,
            'days_since_roast': brew_log.days_since_roast,
        }

    def _bag_event_row(self, event):
        return {
            'short_id': f'bagevent-{event.id}',
            'bean_name': event.bean.name if event.bean else '-',
            'bean_short_id': event.bean.short_id if event.bean else '-',
            'style': 'bag_event',
            'style_display': f'Bag {event.get_event_type_display()}',
            'event_type': event.event_type,
            'date': event.date,
            'extraction_rating': None,
            'pull_number': None,
            'detail_id': None,
            'days_since_opened': None,
            'days_since_roast': None,
        }


# ---------------------------------------------------------------------------
# Style detail tables
# ---------------------------------------------------------------------------

class AeropressDetailViewSet(SuperUserDestroyMixin, viewsets.ModelViewSet):
    queryset = AeropressDetail.objects.select_related('brew_log', 'grinder', 'scale', 'kettle').prefetch_related('hoffmann_events').all()
    lookup_field = 'brew_log__short_id'
    lookup_url_kwarg = 'short_id' 
    filter_backends = [OrderingFilter, SearchFilter]

    def get_serializer_class(self):
        if self.action == 'list':
            return AeropressDetailListSerializer
        if self.action == 'retrieve':
            return AeropressDetailReadSerializer
        return AeropressDetailSerializer

class PouroverDetailViewSet(SuperUserDestroyMixin, viewsets.ModelViewSet):
    queryset = PouroverDetail.objects.select_related('brew_log', 'grinder', 'scale', 'kettle').prefetch_related('pour_events').all()
    lookup_field = 'brew_log__short_id'
    lookup_url_kwarg = 'short_id' 
    serializer_class = PouroverDetailSerializer
    filter_backends = [OrderingFilter, SearchFilter]

    def get_serializer_class(self):
        if self.action == 'list':
            return PouroverDetailListSerializer  # if you have one; else reuse read
        if self.action == 'retrieve':
            return PouroverDetailReadSerializer
        return PouroverDetailSerializer


class ColdBrewDetailViewSet(SuperUserDestroyMixin, viewsets.ModelViewSet):
    queryset = ColdBrewDetail.objects.select_related('brew_log', 'grinder', 'scale').all()
    lookup_field = 'brew_log__short_id'
    lookup_url_kwarg = 'short_id' 
    serializer_class = ColdBrewDetailSerializer
    filter_backends = [OrderingFilter, SearchFilter]


class EspressoDetailViewSet(SuperUserDestroyMixin, viewsets.ModelViewSet):
    queryset = EspressoDetail.objects.select_related('brew_log', 'grinder', 'scale').all()
    lookup_field = 'brew_log__short_id'
    lookup_url_kwarg = 'short_id' 
    filter_backends = [OrderingFilter, SearchFilter]

    def get_serializer_class(self):
        if self.action == 'list':
            return EspressoDetailListSerializer  # if you have one; else reuse read
        if self.action == 'retrieve':
            return EspressoDetailReadSerializer
        return EspressoDetailSerializer