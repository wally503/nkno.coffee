from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from .serializers import *
from .models import *

class RoasterViewSet(viewsets.ModelViewSet):
    queryset = Roaster.objects.all()
    serializer_class = RoasterSerializer
    lookup_field = 'short_id'

    def get_serializer_class(self):
        match self.action:
            case 'list':
                return RoasterListSerializer
            case _:
                return RoasterSerializer
    
class BeanViewSet(viewsets.ModelViewSet):
    queryset = Bean.objects.all()
    serializer_class = BeanSerializer
    lookup_field = 'short_id'

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