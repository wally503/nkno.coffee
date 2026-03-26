from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from .serializers import *
from .models import *

class RoasterViewSet(viewsets.ModelViewSet):
    queryset = Roaster.objects.all()
    serializer_class = RoasterSerializer
    
class BeanViewSet(viewsets.ModelViewSet):
    queryset = Bean.objects.all()
    serializer_class = BeanSerializer

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
        return Response(serializer.data, status=201)

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