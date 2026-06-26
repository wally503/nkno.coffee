from django.shortcuts import render
from django.db.models import Count
from django.db.models.functions import Coalesce
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from .serializers import *
from .models import *

class RoasterViewSet(viewsets.ModelViewSet):
    queryset = Roaster.objects.all()
    serializer_class = RoasterSerializer
    lookup_field = 'short_id'
    filter_backends = [OrderingFilter, SearchFilter]
    search_fields = ['name', 'business_type', 'country__name', 'region__name', 'city']
    ordering_fields = ['name', 'business_type', 'country__name', 'region__name', 'city', 'total_beans', 'total_drinks']
    ordering = ['name']

    @action(detail=False, methods=['get'])
    def country_counts(self, request):
        queryset = (Roaster.objects
            .filter(country__isnull=False)
            .values('country__iso_code')
            .annotate(count=Count('id')))
        return Response(queryset.values('country__iso_code', 'count'))

    @action(detail=False, methods=['get'])
    def region_counts(self, request):
        country = self.request.query_params.get('country')
        queryset = (Roaster.objects
            .filter(country__isnull=False)
            .filter(country__id=country)
            .values('region__identifier_code')
            .annotate(count=Count('id')))
        return Response(queryset.values('region__identifier_code', 'count'))

    def get_serializer_class(self):
        match self.action:
            case 'list':
                return RoasterListSerializer
            case _:
                return RoasterSerializer
    
    def get_queryset(self):
        return Roaster.objects.annotate(
            total_beans=Count('beans', distinct=True),
            total_drinks=Count('drink', distinct=True)
        )
    
class BeanViewSet(viewsets.ModelViewSet):
    queryset = Bean.objects.all().distinct()
    serializer_class = BeanSerializer
    lookup_field = 'short_id'
    filter_backends = [OrderingFilter, SearchFilter]
    search_fields = ['name', 'roaster__name', 'origin_country__name', 'roast_level', 'washing_style', 'flavor_notes__name']
    ordering_fields = ['name', 'roaster__name', 'origin_country__name', 'roast_level', 'washing_style', 'purchase_date']  # whitelist what's sortable
    ordering = ['name']  # default ordering

    def create(self, request):
        flav_notes = request.data.get('flavor_notes')
        data = request.data.copy()
        if flav_notes:
            data['flavor_notes'] = []
            note_objects = []
            for note in flav_notes:
                note_obj, _ = FlavorNotes.objects.get_or_create(name=note)
                note_objects.append(note_obj)
            data['flavor_notes'] = [n.id for n in note_objects]
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        bean = serializer.save()
        return Response(BeanListSerializer(bean).data, status=201)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        flav_notes = request.data.get('flavor_notes')
        data = request.data.copy()
        if flav_notes:
            data['flavor_notes'] = []
            note_objects = []
            for note in flav_notes:
                note_obj, _ = FlavorNotes.objects.get_or_create(name=note)
                note_objects.append(note_obj)
            data['flavor_notes'] = [n.id for n in note_objects]
        serializer = self.get_serializer(instance, data=data)
        serializer.is_valid(raise_exception=True)
        bean = serializer.save()
        return Response(BeanListSerializer(bean).data, status=201)

    @action(detail=False, methods=['get'])
    def country_counts(self, request):
        queryset = (Bean.objects
            .filter(origin_country__isnull=False)
            .values('origin_country__iso_code')
            .annotate(count=Count('id')))
        return Response(queryset.values('origin_country__iso_code', 'count'))

    def get_queryset(self):
        queryset = super().get_queryset()
        roaster = self.request.query_params.get('roaster')
        if roaster:
            queryset = queryset.filter(roaster__short_id=roaster)
        return queryset

    def get_serializer_class(self):
        match self.action:
            case 'list':
                return BeanListSerializer
            case _:
                return BeanSerializer
    
class DrinkViewSet(viewsets.ModelViewSet):
    queryset = Drink.objects.all()
    serializer_class = DrinkSerializer
    lookup_field = 'short_id'

    def get_queryset(self):
        queryset = super().get_queryset()
        roaster = self.request.query_params.get('roaster')
        if roaster:
            queryset = queryset.filter(roaster__short_id=roaster)
        return queryset

    def get_serializer_class(self):
        match self.action:
            case 'create' | 'retrieve' :
                return DrinkCreateSerializer
            case _:
                return DrinkSerializer
    
class CountriesViewSet(viewsets.ModelViewSet):
    queryset = Countries.objects.all()
    serializer_class = CountriesSerializer

class FlavorNotesViewSet(viewsets.ModelViewSet):
    queryset = FlavorNotes.objects.all()
    serializer_class = FlavorNotesSerializer

class RegionsViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionsSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        country = self.request.query_params.get('country')
        if country:
            queryset = queryset.filter(country_id=country)
        return queryset

    def get_serializer_class(self):
        match self.action:
            case _:
                return RegionsSerializer

class MapzoneViewSet(viewsets.ModelViewSet):
    queryset = MapZone.objects.all()
    serializer_class = MapZoneSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        zone = self.request.query_params.get('zone_name')
        if zone:
            queryset = queryset.filter(zone_name=zone)
        return queryset