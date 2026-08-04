# brew/views.py

from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from .models import (
    Grinder, BrewVessel, Water, Cup,
    BrewMethod, BrewTool, GrinderSetting, VesselSetting,
)
from .serializers import (
    GrinderSerializer,
    BrewVesselSerializer,
    WaterSerializer,
    CupSerializer,
    BrewMethodSerializer,
    BrewToolSerializer,
    GrinderSettingSerializer,
    GrinderSettingListSerializer,
    VesselSettingSerializer,
    VesselSettingListSerializer,
)

class GrinderViewSet(viewsets.ModelViewSet):
    queryset = Grinder.objects.all()
    serializer_class = GrinderSerializer
    lookup_field = 'short_id'
    filter_backends = [OrderingFilter, SearchFilter]
    search_fields = ['name', 'brand']
    ordering_fields = ['name', 'brand']

class BrewVesselViewSet(viewsets.ModelViewSet):
    queryset = BrewVessel.objects.all()
    serializer_class = BrewVesselSerializer
    lookup_field = 'short_id'
    filter_backends = [OrderingFilter, SearchFilter]
    search_fields = ['name', 'brand']
    ordering_fields = ['name', 'brand']

class CatalogViewSet(viewsets.ModelViewSet):
    lookup_field = 'short_id'
    filter_backends = [OrderingFilter, SearchFilter]

class WaterViewSet(CatalogViewSet):
    queryset = Water.objects.all()
    serializer_class = WaterSerializer
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'description']

class CupViewSet(CatalogViewSet):
    queryset = Cup.objects.all()
    serializer_class = CupSerializer
    search_fields = ['name', 'material', 'capacity']
    ordering_fields = ['name', 'material', 'capacity']

class BrewMethodViewSet(CatalogViewSet):
    queryset = BrewMethod.objects.all()
    serializer_class = BrewMethodSerializer
    search_fields = ['name']
    ordering_fields = ['name', 'is_dormant']

class BrewToolViewSet(CatalogViewSet):
    queryset = BrewTool.objects.all()
    serializer_class = BrewToolSerializer
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'description']

class GrinderSettingViewSet(CatalogViewSet):
    queryset = GrinderSetting.objects.select_related('grinder')
    search_fields = ['setting_name', 'description', 'grinder__name']
    ordering_fields = ['setting_name', 'description', 'grinder__name']

    def get_serializer_class(self):
        if self.action == 'list':
            return GrinderSettingListSerializer
        return GrinderSettingSerializer

class VesselSettingViewSet(CatalogViewSet):
    queryset = VesselSetting.objects.select_related('vessel')
    search_fields = ['name', 'setting_name', 'description', 'vessel__name']
    ordering_fields = ['name', 'setting_name', 'vessel__name']

    def get_serializer_class(self):
        if self.action == 'list':
            return VesselSettingListSerializer
        return VesselSettingSerializer