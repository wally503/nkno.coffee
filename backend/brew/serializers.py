# brew/serializers.py

from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from rest_framework import serializers
from .models import *
from coffee.draws import LotShortfall, adjust_draw, close_prompt_for, default_lot_for, draw_from_lot
from coffee.models import Bean, LotSplit
from .fields import MMSSDurationField

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
# Tags - Simple Remark Notations / Review Highlights
# ---------------------------------------------------------------------------

class BrewTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrewTag
        fields = ["slug", "name", "category", "color"]

class BrewTagField(serializers.SlugRelatedField):
    """Write: slug strings. Read: full tag objects."""
    def to_representation(self, obj):
        return BrewTagSerializer(obj).data


# ---------------------------------------------------------------------------
# BrewLog
# ---------------------------------------------------------------------------

class BrewLogSerializer(serializers.ModelSerializer):
    bean = serializers.SlugRelatedField(slug_field='short_id', queryset=Bean.objects.all())
    days_since_roast = serializers.ReadOnlyField()
    days_since_opened = serializers.ReadOnlyField()
    tags = BrewTagField(
        many=True, slug_field='slug',
        queryset=BrewTag.objects.all(), required=False,
    )
    # Inputs for the lot draw. Neither is a BrewLog column: the detail serializers'
    # create()/update() pop them and hand them to coffee.draws.
    lot = serializers.PrimaryKeyRelatedField(
        queryset=LotSplit.objects.all(), write_only=True, required=False, allow_null=True,
    )
    correct_remaining = serializers.DecimalField(
        max_digits=7, decimal_places=2, write_only=True, required=False, allow_null=True,
    )
    # Second lot for a split brew (only used when the dose is more than `lot` holds).
    split_lot = serializers.PrimaryKeyRelatedField(
        queryset=LotSplit.objects.all(), write_only=True, required=False, allow_null=True,
    )

    class Meta:
        model = BrewLog
        fields = '__all__'
        read_only_fields = ['short_id', 'pull_number']

    # Direct use of this serializer (the brewlogs endpoint) doesn't draw from a lot,
    # so drop the draw-only inputs rather than pass them to the model.
    def create(self, validated_data):
        validated_data.pop('lot', None)
        validated_data.pop('correct_remaining', None)
        validated_data.pop('split_lot', None)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop('lot', None)
        validated_data.pop('correct_remaining', None)
        validated_data.pop('split_lot', None)
        return super().update(instance, validated_data)


class BrewLogListSerializer(serializers.ModelSerializer):
    bean_name = serializers.SerializerMethodField()
    style_display = serializers.CharField(source='get_style_display', read_only=True)
    detail_id = serializers.SerializerMethodField()
    days_since_roast = serializers.ReadOnlyField()
    days_since_opened = serializers.ReadOnlyField()
    tags = BrewTagSerializer(many=True, read_only=True)

    class Meta: 
        model = BrewLog
        fields = ['short_id', 'bean_name', 'style', 'style_display', 'date', 'extraction_rating', 'pull_number', 'detail_id', 'tags','days_since_roast', 'days_since_opened']

    def get_bean_name(self, obj):
        return obj.bean.name if obj.bean else '-'

    def get_detail_id(self, obj):
        detail = getattr(obj, f'{obj.style}_detail', None)
        return detail.id if detail else None

class BrewLogReadSerializer(serializers.ModelSerializer):
    bean = BeanNestedSerializer(read_only=True)
    days_since_roast = serializers.ReadOnlyField()
    days_since_opened = serializers.ReadOnlyField()
    tags = BrewTagSerializer(many=True, read_only=True)
    lot = serializers.SerializerMethodField()

    class Meta:
        model = BrewLog
        fields = '__all__'

    def get_lot(self, obj):
        """The lot this brew drew from, or None for brews made before lots existed."""
        bridge = next(iter(obj.lotbrewbridge_set.all()), None)
        if bridge is None:
            return None
        lot = bridge.lot
        return {
            'id': lot.pk,
            'vessel_label': 'Original bag' if lot.vessel is None else str(lot.vessel),
        }

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
        tags = brew_log_data.pop('tags', None)
        lot = brew_log_data.pop('lot', None)
        correction = brew_log_data.pop('correct_remaining', None)
        split_lot = brew_log_data.pop('split_lot', None)
        nested_data = self.pop_nested(validated_data)

        if lot is None:
            lot = default_lot_for(brew_log_data['bean'])   # the bean's only drawable lot, if there is exactly one
        if lot is None:
            raise serializers.ValidationError({'brew_log': {'lot': ['Pick a lot to draw from.']}})
        if lot.bean_id != brew_log_data['bean'].pk:
            raise serializers.ValidationError({'brew_log': {'lot': ['That lot belongs to a different bean.']}})

        try:
            with transaction.atomic():
                brew_log = BrewLog.objects.create(**brew_log_data)
                if tags is not None:
                    brew_log.tags.set(tags)
                detail = self.detail_model.objects.create(brew_log=brew_log, **validated_data)
                self.create_nested(detail, nested_data)
                # Last step, still inside the transaction: any refusal rolls the whole brew back.
                bridges = draw_from_lot(brew_log, lot, detail.weight, correction, split_lot)
        except LotShortfall as e:
            # Machine-readable numbers so the form can offer to split the brew across two lots.
            raise serializers.ValidationError({'brew_log': {
                'lot': e.messages,
                'lot_shortfall': {'remaining': str(e.remaining), 'needed': str(e.needed)},
            }})
        except DjangoValidationError as e:
            raise serializers.ValidationError({'brew_log': {'lot': e.messages}})

        # Shown once, right after a brew is created: the lot it ended on, if nearly empty.
        detail._close_prompt = close_prompt_for(bridges[-1].lot)
        return detail


    def update(self, instance, validated_data):
        brew_log_data = validated_data.pop('brew_log', None)
        tags = brew_log_data.pop('tags', None) if brew_log_data else None
        lot = brew_log_data.pop('lot', None) if brew_log_data else None
        correction = brew_log_data.pop('correct_remaining', None) if brew_log_data else None
        nested_data = self.pop_nested(validated_data, for_update=True)

        if lot is not None and lot.bean_id != instance.brew_log.bean_id:
            raise serializers.ValidationError({'brew_log': {'lot': ['That lot belongs to a different bean.']}})

        try:
            with transaction.atomic():
                if brew_log_data:
                    brew_log_data.pop('bean', None)
                    brew_log_data.pop('style', None)
                    brew_log = instance.brew_log
                    for attr, value in brew_log_data.items():
                        setattr(brew_log, attr, value)
                    brew_log.save()

                if tags is not None:
                    instance.brew_log.tags.set(tags)

                for attr, value in validated_data.items():
                    setattr(instance, attr, value)
                instance.save()

                self.update_nested(instance, nested_data)
                adjust_draw(instance.brew_log, lot, instance.weight, correction)
        except DjangoValidationError as e:
            raise serializers.ValidationError({'brew_log': {'lot': e.messages}})

        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['close_prompt'] = getattr(instance, '_close_prompt', None)
        return data

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
    rotation_time = MMSSDurationField()
    
    class Meta:
        model = HoffmannEvent
        fields = ['id', 'rotation_time', 'rotation_count']


class AeropressDetailSerializer(AtomicDetailCreateMixin, serializers.ModelSerializer):
    hoffmann_events = HoffmannEventSerializer(many=True, required=False)
    grinder = serializers.SlugRelatedField(slug_field='short_id', queryset=Grinder.objects.all())
    scale = serializers.SlugRelatedField(slug_field='short_id', queryset=Scale.objects.all())
    kettle = serializers.SlugRelatedField(slug_field='short_id', queryset=Kettle.objects.all())
    brew_log = BrewLogSerializer()

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
            'press_time',
            'press_duration'
        ]

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
    press_time = MMSSDurationField()
    press_duration = MMSSDurationField()

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
            'press_time',
            'press_duration'
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
    pour_time = MMSSDurationField()
    pour_duration = MMSSDurationField()
    
    class Meta:
        model = PouroverPourEvent
        fields = ['id', 'pour_time', 'pour_amount', 'pour_style', 'pour_duration']


class PouroverDetailSerializer(AtomicDetailCreateMixin, serializers.ModelSerializer):
    pour_events = PouroverPourEventSerializer(many=True, required=False)
    grinder = serializers.SlugRelatedField(slug_field='short_id', queryset=Grinder.objects.all())
    scale = serializers.SlugRelatedField(slug_field='short_id', queryset=Scale.objects.all())
    kettle = serializers.SlugRelatedField(slug_field='short_id', queryset=Kettle.objects.all())
    brew_log = BrewLogSerializer()
    stop_time = MMSSDurationField(required=True)
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
            'stop_time'
        ]

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
    stop_time = MMSSDurationField() 
    
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
            'stop_time'
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

    detail_model = ColdBrewDetail

    class Meta:
        model = ColdBrewDetail
        fields = '__all__'

class ColdBrewDetailReadSerializer(serializers.ModelSerializer):
    brew_log = BrewLogReadSerializer(read_only=True)
    grinder = GrinderNestedSerializer(read_only=True)
    scale = ScaleNestedSerializer(read_only=True)

    class Meta:
        model = ColdBrewDetail
        fields = [
            'brew_log', 'grinder', 'scale',
            'grind_rotations', 'grind_position', 'water_type',
            'weight', 'filter_style', 'water', 'steep_hours',
        ]


# ---------------------------------------------------------------------------
# Cupping
# ---------------------------------------------------------------------------

class CuppingDetailSerializer(AtomicDetailCreateMixin, serializers.ModelSerializer):
    brew_log = BrewLogSerializer()
    grinder = serializers.SlugRelatedField(slug_field='short_id', queryset=Grinder.objects.all())
    scale = serializers.SlugRelatedField(slug_field='short_id', queryset=Scale.objects.all())
    kettle = serializers.SlugRelatedField(slug_field='short_id', queryset=Kettle.objects.all())
    
    detail_model = CuppingDetail

    class Meta:
        model = CuppingDetail
        fields = '__all__'


class CuppingDetailReadSerializer(serializers.ModelSerializer):
    brew_log = BrewLogReadSerializer(read_only=True)
    grinder = GrinderNestedSerializer(read_only=True)
    scale = ScaleNestedSerializer(read_only=True)
    kettle = KettleNestedSerializer(read_only=True)
    steep_time = MMSSDurationField()

    class Meta:
        model = CuppingDetail
        fields = [
            'brew_log', 'grinder', 'scale', 'kettle',
            'grind_rotations', 'grind_position', 'water_type',
            'weight', 'water', 'steep_time',
        ]
        
# ---------------------------------------------------------------------------
# Espresso
# ---------------------------------------------------------------------------

class EspressoDetailSerializer(AtomicDetailCreateMixin, serializers.ModelSerializer):
    grinder = serializers.SlugRelatedField(slug_field='short_id', queryset=Grinder.objects.all())
    scale = serializers.SlugRelatedField(slug_field='short_id', queryset=Scale.objects.all())
    brew_log = BrewLogSerializer()
    pull_time = MMSSDurationField()
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
            'pull_weight',
        ]


class EspressoDetailReadSerializer(serializers.ModelSerializer):
    brew_log = BrewLogReadSerializer(read_only=True)
    grinder = GrinderNestedSerializer(read_only=True)
    scale = ScaleNestedSerializer(read_only=True)
    pull_time = MMSSDurationField()
    
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
            'pull_weight',
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

