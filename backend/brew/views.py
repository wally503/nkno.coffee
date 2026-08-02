# brew/views.py

from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from .models import Grinder, BrewVessel
from .serializers import GrinderSerializer, BrewVesselSerializer

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