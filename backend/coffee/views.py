from django.shortcuts import render
from rest_framework import viewsets
from .serializers import *
from .models import *

class RoasterViewSet(viewsets.ModelViewSet):
    queryset = Roaster.objects.all()
    serializer_class = RoasterSerializer
    
class BeanViewSet(viewsets.ModelViewSet):
    queryset = Bean.objects.all()
    serializer_class = BeanSerializer

    def get_serializer_class(self):
        match self.action:
            case 'list':
                return BeanListSerializer
            case _:
                return BeanSerializer
    
class CafeLogViewSet(viewsets.ModelViewSet):
    queryset = CafeLog.objects.all()
    serializer_class = CafeLogSerializer
    
class CountriesViewSet(viewsets.ModelViewSet):
    queryset = OriginCountry.objects.all()
    serializer_class = CountriesSerializer