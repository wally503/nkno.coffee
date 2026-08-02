# brew/serializers.py

from rest_framework import serializers
from .models import Grinder, BrewVessel

class GrinderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grinder
        fields = '__all__'
        read_only_fields = ['short_id']

class BrewVesselSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrewVessel
        fields = '__all__'
        read_only_fields = ['short_id']