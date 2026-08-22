# brew/models.py

from django.db import models
import nanoid


# ---------------------------------------------------------------------------
# Choices
# ---------------------------------------------------------------------------

class Style(models.TextChoices):
    ESPRESSO = 'espresso', 'Espresso'
    MILK_DRINK = 'milk_drink', 'Latte / Cappuccino'
    AEROPRESS = 'aeropress', 'Aeropress'
    POUROVER = 'pourover', 'Pourover'
    COLD_BREW = 'cold_brew', 'Cold Brew'


class WaterType(models.TextChoices):
    DISTILLED = 'distilled', 'Straight Distilled'
    TWW_LIGHT = 'tww_light', 'TWW Light'
    TWW_MEDIUM = 'tww_medium', 'TWW Medium'
    TWW_DARK = 'tww_dark', 'TWW Dark'
    TWW_ESPRESSO = 'tww_espresso', 'TWW Espresso'
    TWW_COLD_BREW = 'tww_cold_brew', 'TWW Cold Brew'
    TWW_LOW_ACID = 'tww_low_acid', 'TWW Low Acid'
    TAP = 'tap', 'Tap Water'


class AeropressBase(models.TextChoices):
    STANDARD = 'standard', 'Standard'
    PRISMO = 'prismo', 'Fellow Prismo'


class AeropressFilter(models.TextChoices):
    NONE = 'none', 'None'
    SINGLE = 'single', 'Single'
    CLASSIC = 'classic', 'Classic'

class AeropressOrientation(models.TextChoices):
    STANDARD = 'standard', 'Standard'
    INVERTED = 'inverted', 'Inverted'


class PourDirection(models.TextChoices):
    SPIN = 'spin', 'Spin'
    CENTER = 'center', 'Center'


class CupChoice(models.TextChoices):
    CERAMIC = 'ceramic', 'Ceramic'
    GLASS = 'glass', 'Glass'
    ORIGAMI_AROMA = 'origami_aroma', 'Origami Aroma Cup'


class DripperChoice(models.TextChoices):
    ORIGAMI = 'origami', 'Origami'
    V60 = 'v60', 'V60'

class EspressoMakerChoice(models.TextChoices):
    GAGGIA_UNMOD = 'gaggia_unmod', 'Gaggia Classic Pro E24 (Unmodded)'

class PuckScreenChoice(models.TextChoices):
    NONE = 'none', 'None'
    NORMCORE_316_SS = 'normcore_316_ss', 'Normcore Puck Screen - 316 Stainless Steel'

class BasketChoice(models.TextChoices):
    NC_HIGH_EXT = 'nc_high_ext', 'Normcore High Extraction Basket'
    NC_PREC = 'nc_prec', 'Normcore Precision Basket'

class TamperChoice(models.TextChoices):
    NC_41_FLAT = 'nc_41_flat', 'Normcore V4.1 Spring Loaded Tamper (Flat Base)'

class PreWetChoice(models.TextChoices):
    WET = "wet", "Wet"
    DRY = "dry", "Dry"

class WdtUsedChoice(models.TextChoices):
    USED = "used", "Used"
    NOT_USED = "not_used", "Not Used"

class ColdBrewFilterStyle(models.TextChoices):
    PAPER = 'paper', 'Paper Filter'
    MESH_BAG = 'mesh_bag', 'Mesh / Nut-Milk Bag'
    STRAINER = 'strainer', 'Fine Mesh Strainer (post-steep)'

class PourStyle(models.TextChoices):
    CENTER = 'center', 'Center Focused'
    CLOCKWISE = 'clockwise', 'Clockwise'

class PouroverFilterType(models.TextChoices):
    CLASSIC = 'classic', 'Classic'

# ---------------------------------------------------------------------------
# Equipment lookup tables
# ---------------------------------------------------------------------------

class Grinder(models.Model):
    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=200)
    short_id = models.CharField(max_length=10, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.short_id:
            self.short_id = nanoid.generate(size=8)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} – {self.brand}"


class Scale(models.Model):
    name = models.CharField(max_length=200)
    short_id = models.CharField(max_length=10, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.short_id:
            self.short_id = nanoid.generate(size=8)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Kettle(models.Model):
    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=200)
    short_id = models.CharField(max_length=10, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.short_id:
            self.short_id = nanoid.generate(size=8)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} – {self.brand}"


# ---------------------------------------------------------------------------
# Shared mixin
# ---------------------------------------------------------------------------

class BrewBaseMixin(models.Model):
    grinder = models.ForeignKey(Grinder, on_delete=models.PROTECT)
    grind_rotations = models.PositiveSmallIntegerField()
    grind_position = models.DecimalField(max_digits=3, decimal_places=1)
    water_type = models.CharField(max_length=20, choices=WaterType.choices)
    weight = models.DecimalField(max_digits=5, decimal_places=1)  # bean grams
    scale = models.ForeignKey(Scale, on_delete=models.PROTECT)

    class Meta:
        abstract = True


# ---------------------------------------------------------------------------
# BrewLog — the spine
# ---------------------------------------------------------------------------

class BrewLog(models.Model):
    bean = models.ForeignKey(
        "coffee.Bean",
        on_delete=models.PROTECT,
        related_name="brew_logs",
    )
    style = models.CharField(max_length=20, choices=Style.choices)
    date = models.DateTimeField()
    extraction_rating = models.PositiveSmallIntegerField()
    pull_number = models.PositiveSmallIntegerField(blank=True)
    notes = models.TextField(blank=True)
    short_id = models.CharField(max_length=10, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.short_id:
            self.short_id = nanoid.generate(size=8)

        is_new = self._state.adding

        if is_new and not self.pull_number:
            self.pull_number = self.bean.brew_logs.count() + 1

        super().save(*args, **kwargs)

        if is_new and self.bean.opened_date is None:
            self.bean.opened_date = self.date
            self.bean.save(update_fields=['opened_date'])
            BagLifecycleEvent.objects.create(
                bean=self.bean,
                event_type=BagLifecycleEvent.EventType.OPENED,
                date=self.date,
                time=self.time,
            )

    @property
    def days_since_roast(self):
        if not self.bean.roast_date:
            return None
        return (self.date.date() - self.bean.roast_date).days

    @property
    def days_since_opened(self):
        if not self.bean.opened_date:
            return None
        return (self.date.date() - self.bean.opened_date).days

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.date} – {self.bean} – {self.get_style_display()}"


# ---------------------------------------------------------------------------
# Aeropress
# ---------------------------------------------------------------------------

class AeropressDetail(BrewBaseMixin, models.Model):
    brew_log = models.OneToOneField(BrewLog, on_delete=models.CASCADE, related_name="aeropress_detail")
    base = models.CharField(max_length=20, choices=AeropressBase.choices)
    filter = models.CharField(max_length=20, choices=AeropressFilter.choices)
    pre_wet = models.CharField(max_length=3, choices=PreWetChoice.choices)
    orientation = models.CharField(max_length=20, choices=AeropressOrientation.choices)
    pour_direction = models.CharField(max_length=20, choices=PourDirection.choices)
    cup = models.CharField(max_length=20, choices=CupChoice.choices)
    kettle = models.ForeignKey(Kettle, on_delete=models.PROTECT)
    temp = models.DecimalField(max_digits=5, decimal_places=1)
    water = models.DecimalField(max_digits=6, decimal_places=1)

    def __str__(self):
        return f"Aeropress – {self.brew_log}"


class HoffmannEvent(models.Model):
    aeropress_detail = models.ForeignKey(
        AeropressDetail,
        related_name='hoffmann_events',
        on_delete=models.CASCADE,
    )
    rotation_time = models.DurationField()
    rotation_count = models.PositiveSmallIntegerField()

    class Meta:
        ordering = ['rotation_time']

    def __str__(self):
        return f"{self.aeropress_detail} – {self.rotation_time} x{self.rotation_count}"


# ---------------------------------------------------------------------------
# Pourover
# ---------------------------------------------------------------------------

class PouroverDetail(BrewBaseMixin, models.Model):
    brew_log = models.OneToOneField(BrewLog, on_delete=models.CASCADE, related_name="pourover_detail")
    filter_type = models.CharField(max_length=20, choices=PouroverFilterType.choices)
    filter_brand = models.CharField(max_length=200)
    filter_count = models.PositiveSmallIntegerField()
    pre_wet = models.CharField(max_length=3, choices=PreWetChoice.choices)
    dripper = models.CharField(max_length=20, choices=DripperChoice.choices, default=DripperChoice.ORIGAMI)
    cup = models.CharField(max_length=20, choices=CupChoice.choices)
    kettle = models.ForeignKey(Kettle, on_delete=models.PROTECT)
    water = models.DecimalField(max_digits=6, decimal_places=1)
    temp = models.DecimalField(max_digits=5, decimal_places=1)

    @property
    def total_poured(self):
        return sum((e.pour_amount for e in self.pour_events.all()), start=0)

    @property
    def is_balanced(self):
        return self.total_poured == self.water

    def __str__(self):
        return f"Pourover – {self.brew_log}"


class PouroverPourEvent(models.Model):
    pourover_detail = models.ForeignKey(
        PouroverDetail,
        related_name='pour_events',
        on_delete=models.CASCADE,
    )
    pour_time = models.DurationField()
    pour_amount = models.DecimalField(max_digits=6, decimal_places=1)
    pour_style = models.CharField(max_length=20, choices=PourStyle.choices)

    class Meta:
        ordering = ['pour_time']

    def __str__(self):
        return f"{self.pourover_detail} – {self.pour_time} – {self.pour_amount}ml – {self.get_pour_style_display()}"


# ---------------------------------------------------------------------------
# Cold Brew
# ---------------------------------------------------------------------------

class ColdBrewDetail(BrewBaseMixin, models.Model):
    brew_log = models.OneToOneField(BrewLog, on_delete=models.CASCADE, related_name="coldbrew_detail")
    filter_style = models.CharField(max_length=20, choices=ColdBrewFilterStyle.choices)
    water = models.DecimalField(max_digits=6, decimal_places=1)
    settle_time = models.DurationField()

    def __str__(self):
        return f"Cold Brew – {self.brew_log}"


# ---------------------------------------------------------------------------
# Espresso / Milk drinks — shelved pending mod kit
# ---------------------------------------------------------------------------

class EspressoDetail(BrewBaseMixin, models.Model):
    brew_log = models.OneToOneField(BrewLog, on_delete=models.CASCADE, related_name="espresso_detail")
    wdt_used = models.CharField(max_length=10, choices=WdtUsedChoice.choices)
    wdt_rotations = models.PositiveSmallIntegerField(default=0)
    pull_time = models.DurationField()
    machine = models.CharField(max_length=70, choices=EspressoMakerChoice.choices, default=EspressoMakerChoice.GAGGIA_UNMOD)
    puck_screen = models.CharField(max_length=50, choices=PuckScreenChoice.choices, default=PuckScreenChoice.NONE)
    cup = models.CharField(max_length=20, choices=CupChoice.choices)
    tamper = models.CharField(max_length=50, choices=TamperChoice.choices, default=TamperChoice.NC_41_FLAT)
    basket = models.CharField(max_length=50, choices=BasketChoice.choices, default=BasketChoice.NC_PREC)

    def __str__(self):
        return f"Espresso – {self.brew_log}"

# -----------------------------------------------------------------------------
# Lifecycle Event - standalone open/close bag event tracker for full log view
# -----------------------------------------------------------------------------

class BagLifecycleEvent(models.Model):
    class EventType(models.TextChoices):
        OPENED = 'opened', 'Opened'
        FINISHED = 'finished', 'Finished'

    bean = models.ForeignKey(
        "coffee.Bean",
        on_delete=models.CASCADE,
        related_name="lifecycle_events",
    )
    event_type = models.CharField(max_length=20, choices=EventType.choices)
    date = models.DateTimeField()
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.bean} – {self.get_event_type_display()} – {self.date}"