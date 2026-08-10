# brew/serializers.py

from rest_framework import serializers
from .models import (
    Grinder, BrewVessel, Water, Cup,
    BrewMethod, BrewTool, GrinderSetting, VesselSetting,
    RecipieTemplate, Recipie
)

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

class WaterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Water
        fields = '__all__'
        read_only_fields = ['short_id']

class CupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cup
        fields = '__all__'
        read_only_fields = ['short_id']

class BrewMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrewMethod
        fields = '__all__'
        read_only_fields = ['short_id']

class BrewToolSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrewTool
        fields = '__all__'
        read_only_fields = ['short_id']

class GrinderSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrinderSetting
        fields = '__all__'
        read_only_fields = ['short_id']

class GrinderSettingListSerializer(serializers.ModelSerializer):
    grinder = serializers.SerializerMethodField()

    class Meta:
        model = GrinderSetting
        fields = '__all__'

    def get_grinder(self, obj):
        return obj.grinder.name if obj.grinder else '-'


class VesselSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = VesselSetting
        fields = '__all__'
        read_only_fields = ['short_id']

class VesselSettingListSerializer(serializers.ModelSerializer):
    vessel = serializers.SerializerMethodField()

    class Meta:
        model = VesselSetting
        fields = '__all__'

    def get_vessel(self, obj):
        return obj.vessel.name if obj.vessel else '-'

class RecipieTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipieTemplate
        fields = '__all__'
        read_only_fields = ['short_id']

class RecipieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipie
        fields = '__all__'
        read_only_fields = ['short_id']