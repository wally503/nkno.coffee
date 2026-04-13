from .models import *
from rest_framework import serializers


class RoasterSerializer(serializers.ModelSerializer):
    country = serializers.PrimaryKeyRelatedField(
        queryset=Countries.objects.all(),
        required=True
    )

    class Meta:
        model = Roaster
        fields = '__all__'


class RoasterListSerializer(serializers.ModelSerializer):
    country = serializers.SerializerMethodField()
    # region = serializers.PrimaryKeyRelatedField(
    #     queryset=Region.objects.all(),
    #     required=True
    # )
    region = serializers.SerializerMethodField()
    city = serializers.SerializerMethodField()
    business_type = serializers.SerializerMethodField()
    total_drinks = serializers.SerializerMethodField()
    total_beans = serializers.SerializerMethodField()

    def get_country(self, obj):
        return obj.country.name if obj.country else '-'
    
    def get_region(self, obj):
        return obj.region.name if obj.region else '-'

    def get_city(self, obj):
        return obj.city if obj.city else '-'

    def get_business_type(self, obj):
        return obj.business_type if obj.business_type else '-'

    def get_total_drinks(self, obj):
        return obj.drink_set.count()

    def get_total_beans(self, obj):
        return obj.beans.count()

    class Meta:
        model = Roaster
        fields = ['id', 'name', 'business_type', 'country', 'city', 'region', 'short_id', 'total_beans', 'total_drinks']

class BeanSerializer(serializers.ModelSerializer):
    # flavor_notes = serializers.ListField(
    #     child=serializers.CharField(),
    #     required=False
    # )

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
        fields = ['id', 'name', 'roaster', 'origin_country', 'organic_or_not', 'washing_style', 'flavor_notes', 'elevation', 'short_id', 'purchase_date']

class DrinkSerializer(serializers.ModelSerializer):
    roaster = serializers.SerializerMethodField()
    bean = serializers.SerializerMethodField()

    def get_bean(self,obj):
        return obj.bean.name if obj.bean else '-'
    
    def get_roaster(self,obj):
        return obj.roaster.name if obj.roaster else '-'

    class Meta:
        model = Drink
        fields = ['id', 'drink', 'rating', 'notes', 'roaster', 'bean', 'short_id', 'drink_date']

class DrinkCreateSerializer(serializers.ModelSerializer):
    roaster = serializers.PrimaryKeyRelatedField(
        queryset=Roaster.objects.all(),
        required=True
    )

    class Meta:
        model = Drink
        fields = '__all__'

class CountriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Countries
        fields = '__all__'

class FlavorNotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlavorNotes
        fields = '__all__'

class RegionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'