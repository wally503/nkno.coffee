# brew/serializers.py

from django.db import transaction
from rest_framework import serializers
from .models import *
from coffee.models import Bean

# ---------------------------------------------------------------------------
# Equipment lookups
# ---------------------------------------------------------------------------

class GrinderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grinder
        fields = '__all__'
        read_only_fields = ['short_id']

class GrinderNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grinder
        exclude = ['id']

class ScaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scale
        fields = '__all__'
        read_only_fields = ['short_id']

class ScaleNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scale
        exclude = ['id']

class KettleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kettle
        fields = '__all__'
        read_only_fields = ['short_id']

class KettleNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kettle
        exclude = ['id']

class BeanNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bean
        fields = ['short_id', 'name', 'roaster']

# ---------------------------------------------------------------------------
# BrewLog
# ---------------------------------------------------------------------------

class BrewLogSerializer(serializers.ModelSerializer):
    bean = serializers.SlugRelatedField(slug_field='short_id', queryset=Bean.objects.all())
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
    days_since_roast = serializers.ReadOnlyField()
    days_since_opened = serializers.ReadOnlyField()

    class Meta:
        model = BrewLog
        fields = ['short_id', 'bean_name', 'style', 'style_display', 'date', 'extraction_rating', 'pull_number', 'detail_id', 'days_since_roast', 'days_since_opened']

    def get_bean_name(self, obj):
        return obj.bean.name if obj.bean else '-'

    def get_detail_id(self, obj):
        detail = getattr(obj, f'{obj.style}_detail', None)
        return detail.id if detail else None

class BrewLogReadSerializer(serializers.ModelSerializer):
    bean = BeanNestedSerializer(read_only=True)
    days_since_roast = serializers.ReadOnlyField()
    days_since_opened = serializers.ReadOnlyField()

    class Meta:
        model = BrewLog
        fields = '__all__'

# ---------------------------------------------------------------------------
# Shared mixin — atomic BrewLog + Detail creation
# ---------------------------------------------------------------------------

class AtomicDetailCreateMixin:
    """
    Shared create()/update() for OneToOne brew-detail serializers
    (Aeropress/Pourover/Espresso/ColdBrew). `brew_log` is a nested
    writable BrewLogSerializer on create only — both rows are created
    in one transaction, so a failure on either side rolls back both,
    preventing orphaned BrewLog rows (the old two-step frontend flow
    could leave a BrewLog with no matching detail if the second POST
    failed).

    On update, brew_log is immutable (it's a OneToOne set at creation)
    and is dropped from the payload rather than allowing a rebind.

    Subclasses set `detail_model` and, if they have a nested many-field
    (hoffmann_events / pour_events), override pop_nested/create_nested/
    update_nested. Styles with no nested many-field (espresso, cold brew)
    can leave those as the no-op defaults below.
    """
    detail_model = None  # set by subclass

    def create(self, validated_data):
        brew_log_data = validated_data.pop('brew_log')
        nested_data = self.pop_nested(validated_data)

        with transaction.atomic():
            brew_log = BrewLog.objects.create(**brew_log_data)
            detail = self.detail_model.objects.create(brew_log=brew_log, **validated_data)
            self.create_nested(detail, nested_data)

        return detail

    def update(self, instance, validated_data):
        validated_data.pop('brew_log', None)  # immutable post-create
        nested_data = self.pop_nested(validated_data, for_update=True)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        self.update_nested(instance, nested_data)
        return instance

    # Hooks for the one nested many-field each style has, if any.
    def pop_nested(self, validated_data, for_update=False):
        return None

    def create_nested(self, detail, nested_data):
        pass

    def update_nested(self, instance, nested_data):
        pass


# ---------------------------------------------------------------------------
# Aeropress
# ---------------------------------------------------------------------------

class HoffmannEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = HoffmannEvent
        fields = ['id', 'rotation_time', 'rotation_count']


class AeropressDetailSerializer(AtomicDetailCreateMixin, serializers.ModelSerializer):
    hoffmann_events = HoffmannEventSerializer(many=True, required=False)
    grinder = serializers.SlugRelatedField(slug_field='short_id', queryset=Grinder.objects.all())
    scale = serializers.SlugRelatedField(slug_field='short_id', queryset=Scale.objects.all())
    kettle = serializers.SlugRelatedField(slug_field='short_id', queryset=Kettle.objects.all())
    brew_log = BrewLogSerializer()
    needs_bag_close_prompt = serializers.SerializerMethodField()

    detail_model = AeropressDetail

    class Meta:
        model = AeropressDetail
        fields = [
            'hoffmann_events',
            'brew_log',
            'grind_rotations',
            'grind_position',
            'water_type',
            'weight',
            'base',
            'filter',
            'pre_wet',
            'orientation',
            'pour_direction',
            'cup',
            'temp',
            'water',
            'grinder',
            'scale',
            'kettle',
            'needs_bag_close_prompt',
        ]

    def get_needs_bag_close_prompt(self, obj):
        return getattr(obj, '_bag_close_prompt', False)

    def pop_nested(self, validated_data, for_update=False):
        return validated_data.pop('hoffmann_events', [] if not for_update else None)

    def create_nested(self, detail, events_data):
        for event_data in events_data:
            HoffmannEvent.objects.create(aeropress_detail=detail, **event_data)

    def update_nested(self, instance, events_data):
        if events_data is not None:
            instance.hoffmann_events.all().delete()
            for event_data in events_data:
                HoffmannEvent.objects.create(aeropress_detail=instance, **event_data)


class AeropressDetailReadSerializer(serializers.ModelSerializer):
    """View mode — expanded/nested, no id, read-only."""
    hoffmann_events = HoffmannEventSerializer(many=True, read_only=True)
    brew_log = BrewLogReadSerializer(read_only=True)
    grinder = GrinderNestedSerializer(read_only=True)
    scale = ScaleNestedSerializer(read_only=True)
    kettle = KettleNestedSerializer(read_only=True)

    class Meta:
        model = AeropressDetail
        fields = [
            'hoffmann_events',
            'brew_log',
            'grind_rotations',
            'grind_position',
            'water_type',
            'weight',
            'base',
            'filter',
            'pre_wet',
            'orientation',
            'pour_direction',
            'cup',
            'temp',
            'water',
            'grinder',
            'scale',
            'kettle',
        ]


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


class PouroverDetailSerializer(AtomicDetailCreateMixin, serializers.ModelSerializer):
    pour_events = PouroverPourEventSerializer(many=True, required=False)
    grinder = serializers.SlugRelatedField(slug_field='short_id', queryset=Grinder.objects.all())
    scale = serializers.SlugRelatedField(slug_field='short_id', queryset=Scale.objects.all())
    kettle = serializers.SlugRelatedField(slug_field='short_id', queryset=Kettle.objects.all())
    brew_log = BrewLogSerializer()
    needs_bag_close_prompt = serializers.SerializerMethodField()

    dripper = serializers.ChoiceField(choices=DripperChoice.choices, required=True)

    detail_model = PouroverDetail

    class Meta:
        model = PouroverDetail
        fields = [
            'pour_events',
            'brew_log',
            'grind_rotations',
            'grind_position',
            'water_type',
            'weight',
            'filter_type',
            'filter_brand',
            'filter_count',
            'pre_wet',
            'dripper',
            'cup',
            'kettle',
            'water',
            'temp',
            'grinder',
            'scale',
            'needs_bag_close_prompt',
        ]

    def get_needs_bag_close_prompt(self, obj):
        return getattr(obj, '_bag_close_prompt', False)

    def pop_nested(self, validated_data, for_update=False):
        return validated_data.pop('pour_events', [] if not for_update else None)

    def create_nested(self, detail, events_data):
        for event_data in events_data:
            PouroverPourEvent.objects.create(pourover_detail=detail, **event_data)

    def update_nested(self, instance, events_data):
        if events_data is not None:
            instance.pour_events.all().delete()
            for event_data in events_data:
                PouroverPourEvent.objects.create(pourover_detail=instance, **event_data)


class PouroverDetailReadSerializer(serializers.ModelSerializer):
    brew_log = BrewLogReadSerializer(read_only=True)
    grinder = GrinderNestedSerializer(read_only=True)
    scale = ScaleNestedSerializer(read_only=True)
    kettle = KettleNestedSerializer(read_only=True)
    pour_events = PouroverPourEventSerializer(many=True, read_only=True)

    class Meta:
        model = PouroverDetail
        fields = [
            'brew_log',
            'dripper',
            'filter_brand',
            'filter_count',
            'filter_type',
            'pre_wet',
            'kettle',
            'scale',
            'cup',
            'grinder',
            'grind_rotations',
            'grind_position',
            'water_type',
            'temp',
            'water',
            'weight',
            'pour_events',
            'total_poured',
            'is_balanced',
        ]


class PouroverDetailListSerializer(serializers.ModelSerializer):
    date = serializers.DateField(source='brew_log.date', read_only=True)
    bean_name = serializers.SerializerMethodField()
    extraction_rating = serializers.IntegerField(source='brew_log.extraction_rating', read_only=True)
    grinder_name = serializers.SerializerMethodField()

    class Meta:
        model = PouroverDetail
        fields = ['id', 'date', 'bean_name', 'extraction_rating', 'dripper', 'grinder_name']

    def get_bean_name(self, obj):
        return obj.brew_log.bean.name if obj.brew_log and obj.brew_log.bean else '-'

    def get_grinder_name(self, obj):
        return obj.grinder.name if obj.grinder else '-'


# ---------------------------------------------------------------------------
# Cold Brew
# ---------------------------------------------------------------------------

class ColdBrewDetailSerializer(AtomicDetailCreateMixin, serializers.ModelSerializer):
    brew_log = BrewLogSerializer()
    grinder = serializers.SlugRelatedField(slug_field='short_id', queryset=Grinder.objects.all())
    scale = serializers.SlugRelatedField(slug_field='short_id', queryset=Scale.objects.all())
    needs_bag_close_prompt = serializers.SerializerMethodField()

    detail_model = ColdBrewDetail

    class Meta:
        model = ColdBrewDetail
        fields = '__all__'

    def get_needs_bag_close_prompt(self, obj):
        return getattr(obj, '_bag_close_prompt', False)


# ---------------------------------------------------------------------------
# Espresso
# ---------------------------------------------------------------------------

class EspressoDetailSerializer(AtomicDetailCreateMixin, serializers.ModelSerializer):
    grinder = serializers.SlugRelatedField(slug_field='short_id', queryset=Grinder.objects.all())
    scale = serializers.SlugRelatedField(slug_field='short_id', queryset=Scale.objects.all())
    brew_log = BrewLogSerializer()
    needs_bag_close_prompt = serializers.SerializerMethodField()

    machine = serializers.ChoiceField(choices=EspressoMakerChoice.choices, required=True)
    basket = serializers.ChoiceField(choices=BasketChoice.choices, required=True)
    puck_screen = serializers.ChoiceField(choices=PuckScreenChoice.choices, required=True)
    tamper = serializers.ChoiceField(choices=TamperChoice.choices, required=True)
    wdt_rotations = serializers.IntegerField(required=True)
    paper_filter_used = serializers.ChoiceField(choices=EspressoPaperFilterUsedChoice.choices, required=True)
    paper_filter_type = serializers.ChoiceField(choices=EspressoPaperFilterTypeChoice.choices, required=True)
    paper_filter_count = serializers.IntegerField(required=True)

    detail_model = EspressoDetail

    class Meta:
        model = EspressoDetail
        fields = [
            'brew_log',
            'machine',
            'basket',
            'puck_screen',
            'grinder',
            'grind_rotations',
            'grind_position',
            'water_type',
            'weight',
            'scale',
            'cup',
            'tamper',
            'wdt_used',
            'wdt_rotations',
            'paper_filter_used',
            'paper_filter_type',
            'paper_filter_count',
            'pull_time',
            'needs_bag_close_prompt',
        ]

    def get_needs_bag_close_prompt(self, obj):
        return getattr(obj, '_bag_close_prompt', False)


class EspressoDetailReadSerializer(serializers.ModelSerializer):
    brew_log = BrewLogReadSerializer(read_only=True)
    grinder = GrinderNestedSerializer(read_only=True)
    scale = ScaleNestedSerializer(read_only=True)

    class Meta:
        model = EspressoDetail
        fields = [
            'brew_log',
            'machine',
            'basket',
            'puck_screen',
            'grinder',
            'grind_rotations',
            'grind_position',
            'water_type',
            'weight',
            'scale',
            'cup',
            'tamper',
            'wdt_used',
            'wdt_rotations',
            'paper_filter_used',
            'paper_filter_type',
            'paper_filter_count',
            'pull_time',
        ]


class EspressoDetailListSerializer(serializers.ModelSerializer):
    date = serializers.DateField(source='brew_log.date', read_only=True)
    bean_name = serializers.SerializerMethodField()
    extraction_rating = serializers.IntegerField(source='brew_log.extraction_rating', read_only=True)
    grinder_name = serializers.SerializerMethodField()

    class Meta:
        model = EspressoDetail
        fields = ['id', 'date', 'bean_name', 'extraction_rating', 'basket', 'grinder_name']

    def get_bean_name(self, obj):
        return obj.brew_log.bean.name if obj.brew_log and obj.brew_log.bean else '-'

    def get_grinder_name(self, obj):
        return obj.grinder.name if obj.grinder else '-'