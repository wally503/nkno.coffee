from .models import *
from rest_framework import serializers
from datetime import date
from decimal import Decimal
from brew.models import AeropressDetail, PouroverDetail, EspressoDetail, BagLifecycleEvent

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
        return obj.get_business_type_display() if obj.business_type else '-'

    def get_total_drinks(self, obj):
        return obj.drink_set.count()

    def get_total_beans(self, obj):
        return obj.beans.count()

    class Meta:
        model = Roaster
        fields = ['id', 'name', 'business_type', 'country', 'city', 'region', 'short_id', 'total_beans', 'total_drinks', 'date_added']

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
    roast_level = serializers.SerializerMethodField()
    had_as_drink = serializers.SerializerMethodField()

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

    def get_roast_level(self, obj):
        return obj.get_roast_level_display() if obj.roast_level else '-'
    
    def get_had_as_drink(self, obj):
        return obj.drink_set.exists()

    class Meta:
        model = Bean
        fields = ['id', 'name', 'roaster', 'origin_country', 'roast_level', 'organic_or_not', 'washing_style', 'flavor_notes', 'elevation', 'short_id', 'purchase_date', 'date_added', 'comments', "purchased", "had_as_drink"]

class DrinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drink
        fields = '__all__'


class DrinkListSerializer(serializers.ModelSerializer):
    roaster = serializers.SerializerMethodField()
    venue = serializers.SerializerMethodField()
    bean = serializers.SerializerMethodField()

    def get_bean(self, obj):
        return obj.bean.name if obj.bean else '-'

    def get_roaster(self, obj):
        return obj.roaster.name if obj.roaster else '-'
    
    def get_venue(self, obj):
        return obj.venue.name if obj.venue else '-'

    class Meta:
        model = Drink
        fields = ['id', 'drink', 'rating', 'notes', 'roaster', 'bean', 'venue',
                  'short_id', 'drink_date', 'date_added']

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

class MapZoneSerializer(serializers.ModelSerializer):
    countries = serializers.SerializerMethodField()

    def get_countries(self, obj):
        return list(obj.countries.values_list('iso_code', flat=True))

    class Meta:
        model = MapZone
        fields = '__all__'

class BeanLifecycleSerializer(serializers.ModelSerializer):
    grams = serializers.DecimalField(max_digits=6, decimal_places=2)



def _format_grind_value(rotations, position):
    return f"{rotations}.{position}"


def _grind_range(bean, detail_model):
    qs = detail_model.objects.filter(brew_log__bean=bean)
    low = qs.order_by('grind_rotations', 'grind_position').first()
    if not low:
        return "N/A"
    high = qs.order_by('-grind_rotations', '-grind_position').first()

    low_val = _format_grind_value(low.grind_rotations, low.grind_position)
    if low.pk == high.pk:
        return low_val
    high_val = _format_grind_value(high.grind_rotations, high.grind_position)
    return f"{low_val} - {high_val}"


class OpenBagSerializer(serializers.ModelSerializer):
    short_id = serializers.CharField(read_only=True)
    bean_name = serializers.CharField(source='name')
    roaster_name = serializers.CharField(source='roaster.name')
    roasted_on = serializers.DateField(source='roast_date')
    roasted_days_ago = serializers.SerializerMethodField()
    opened_on = serializers.SerializerMethodField()
    opened_days_ago = serializers.SerializerMethodField()
    espresso_grind = serializers.SerializerMethodField()
    pourover_grind = serializers.SerializerMethodField()
    aeropress_grind = serializers.SerializerMethodField()
    remaining_weight = serializers.DecimalField(max_digits=6, decimal_places=1, read_only=True)
    total_weight = serializers.DecimalField(source='bag_weight', max_digits=6, decimal_places=1)
    percent_remaining = serializers.SerializerMethodField()
    flavor_notes = serializers.SerializerMethodField()
    roast_level_display = serializers.SerializerMethodField()
    is_decaf = serializers.SerializerMethodField()
    origin_country_name = serializers.CharField(source='origin_country.name', allow_null=True, read_only=True)

    class Meta:
        model = Bean
        fields = [
            'short_id', 'bean_name', 'roaster_name', 'roast_level_display', 'is_decaf',
            'roasted_on', 'roasted_days_ago', 'opened_on', 'opened_days_ago',
            'espresso_grind', 'pourover_grind', 'aeropress_grind',
            'remaining_weight', 'total_weight', 'percent_remaining',
            'flavor_notes', 'origin_country_name'
        ]

    def get_roast_level_display(self, obj):
        return obj.get_roast_level_display() if obj.roast_level else None

    def get_is_decaf(self, obj):
        return obj.caff_or_decaf == 'decaffeinated'

    def _resolve_opened_date(self, obj):
        # """Returns a date object (not string) — used internally by both opened_on and opened_days_ago."""
        if obj.opened_date:
            return obj.opened_date.date() if hasattr(obj.opened_date, 'date') else obj.opened_date

        lifecycle = obj.lifecycle_events.filter(
            event_type=BagLifecycleEvent.EventType.OPENED
        ).order_by('date').first()
        if lifecycle:
            return lifecycle.date.date()

        oldest_log = obj.brew_logs.order_by('date').first()
        return oldest_log.date.date() if oldest_log else None

    def get_opened_on(self, obj):
        resolved = self._resolve_opened_date(obj)
        return resolved.strftime('%Y-%m-%d') if resolved else None

    def get_opened_days_ago(self, obj):
        resolved = self._resolve_opened_date(obj)
        return (date.today() - resolved).days if resolved else None

    def get_roasted_days_ago(self, obj):
        if not obj.roast_date:
            return None
        return (date.today() - obj.roast_date).days

    def get_espresso_grind(self, obj):
        return _grind_range(obj, EspressoDetail)

    def get_pourover_grind(self, obj):
        return _grind_range(obj, PouroverDetail)

    def get_aeropress_grind(self, obj):
        return _grind_range(obj, AeropressDetail)

    def get_percent_remaining(self, obj):
        if not obj.bag_weight:
            return None
        return round((obj.remaining_weight / obj.bag_weight) * 100, 1)

    def get_flavor_notes(self, obj):
        return [note.name for note in obj.flavor_notes.all()]