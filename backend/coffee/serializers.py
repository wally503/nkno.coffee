from .models import *
from rest_framework import serializers


class RoasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roaster
        fields = '__all__'

class BeanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bean
        fields = '__all__'

class BeanListSerializer(serializers.ModelSerializer):
    flavor_notes = serializers.SerializerMethodField()
    elevation = serializers.SerializerMethodField()
    roaster = serializers.SerializerMethodField()
    origin_country = serializers.SerializerMethodField()
    washing_style = serializers.SerializerMethodField()
    organic_or_not = serializers.SerializerMethodField()

    def get_flavor_notes(self, obj):
        notes = obj.flavor_notes.all()
        return ', '.join(note.name for note in notes) if notes else ''

    def get_elevation(self, obj):
        match (obj.min_elevation, obj.max_elevation):
            case (None, None):
                return '-' 
            case (None, y):
                return f"{y} MASL"
            case (x, None):
                return f"{x} MASL"
            case (x, y):
                return f"{x} - {y} MASL"

    def get_roaster(self, obj):
        return obj.roaster.name

    def get_origin_country(self, obj):
        return obj.origin_country.name if obj.origin_country else '-'
    
    def get_washing_style(self, obj):
        return obj.get_washing_style_display() if obj.washing_style else '-'

    def get_organic_or_not(self, obj):
        return obj.get_organic_or_not_display() if obj.organic_or_not else '-'

    class Meta:
        model = Bean
        fields = ['id', 'name', 'roaster', 'origin_country', 'organic_or_not', 'washing_style', 'flavor_notes', 'elevation']

class CafeLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CafeLog
        fields = '__all__'

class CountriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = OriginCountry
        fields = '__all__'