# brew/serializers.py

from rest_framework import serializers
from .models import (
    Grinder, Scale, Kettle,
    BrewLog,
    AeropressDetail, HoffmannEvent,
    PouroverDetail, PouroverPourEvent,
    ColdBrewDetail,
)


# ---------------------------------------------------------------------------
# Equipment lookups
# ---------------------------------------------------------------------------

class GrinderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grinder
        fields = '__all__'
        read_only_fields = ['short_id']


class ScaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scale
        fields = '__all__'
        read_only_fields = ['short_id']


class KettleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kettle
        fields = '__all__'
        read_only_fields = ['short_id']


# ---------------------------------------------------------------------------
# BrewLog
# ---------------------------------------------------------------------------

class BrewLogSerializer(serializers.ModelSerializer):
    days_since_roast = serializers.ReadOnlyField()
    days_since_opened = serializers.ReadOnlyField()

    class Meta:
        model = BrewLog
        fields = '__all__'
        read_only_fields = ['short_id', 'pull_number']


class BrewLogListSerializer(serializers.ModelSerializer):
    bean_name = serializers.SerializerMethodField()
    style_display = serializers.CharField(source='get_style_display', read_only=True)
    detail_id = serializers.SerializerMethodField()

    class Meta:
        model = BrewLog
        fields = ['short_id', 'bean_name', 'style', 'style_display', 'date', 'extraction_rating', 'pull_number', 'detail_id']

    def get_bean_name(self, obj):
        return obj.bean.name if obj.bean else '-'

    def get_detail_id(self, obj):
        detail = getattr(obj, f'{obj.style}_detail', None)
        return detail.id if detail else None


# ---------------------------------------------------------------------------
# Aeropress
# ---------------------------------------------------------------------------

class HoffmannEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = HoffmannEvent
        fields = ['id', 'rotation_time', 'rotation_count']



class AeropressDetailSerializer(serializers.ModelSerializer):
    hoffmann_events = HoffmannEventSerializer(many=True, required=False)

    class Meta:
        model = AeropressDetail
        fields = '__all__'

    def create(self, validated_data):
        events_data = validated_data.pop('hoffmann_events', [])
        detail = AeropressDetail.objects.create(**validated_data)
        for event_data in events_data:
            HoffmannEvent.objects.create(aeropress_detail=detail, **event_data)
        return detail

    def update(self, instance, validated_data):
        events_data = validated_data.pop('hoffmann_events', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if events_data is not None:
            instance.hoffmann_events.all().delete()
            for event_data in events_data:
                HoffmannEvent.objects.create(aeropress_detail=instance, **event_data)

        return instance


class AeropressDetailListSerializer(serializers.ModelSerializer):
    date = serializers.DateField(source='brew_log.date', read_only=True)
    bean_name = serializers.SerializerMethodField()
    extraction_rating = serializers.IntegerField(source='brew_log.extraction_rating', read_only=True)
    grinder_name = serializers.SerializerMethodField()

    class Meta:
        model = AeropressDetail
        fields = ['id', 'date', 'bean_name', 'extraction_rating', 'orientation', 'grinder_name']

    def get_bean_name(self, obj):
        return obj.brew_log.bean.name if obj.brew_log and obj.brew_log.bean else '-'

    def get_grinder_name(self, obj):
        return obj.grinder.name if obj.grinder else '-'

# ---------------------------------------------------------------------------
# Pourover
# ---------------------------------------------------------------------------

class PouroverPourEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = PouroverPourEvent
        fields = ['id', 'pour_time', 'pour_amount', 'pour_style']


class PouroverDetailSerializer(serializers.ModelSerializer):
    pour_events = PouroverPourEventSerializer(many=True, required=False)
    total_poured = serializers.ReadOnlyField()
    is_balanced = serializers.ReadOnlyField()

    class Meta:
        model = PouroverDetail
        fields = '__all__'

    def create(self, validated_data):
        events_data = validated_data.pop('pour_events', [])
        detail = PouroverDetail.objects.create(**validated_data)
        for event_data in events_data:
            PouroverPourEvent.objects.create(pourover_detail=detail, **event_data)
        return detail

    def update(self, instance, validated_data):
        events_data = validated_data.pop('pour_events', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if events_data is not None:
            instance.pour_events.all().delete()
            for event_data in events_data:
                PouroverPourEvent.objects.create(pourover_detail=instance, **event_data)

        return instance


# ---------------------------------------------------------------------------
# Cold Brew
# ---------------------------------------------------------------------------

class ColdBrewDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColdBrewDetail
        fields = '__all__'