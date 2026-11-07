from django.db import models
from django.utils import timezone
from .choices import CaffOrDecaf, OrganicOrNot, BusinessType, RoastLevel
import nanoid
from decimal import Decimal
from django.db.models import Sum, Q, F
from django.core.exceptions import ValidationError
from datetime import datetime, time

class VesselType(models.Model):
    name = models.CharField(max_length=200, unique=True)
    has_identifier = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    freezable = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name}"

class Vessel(models.Model):
    current_bean = models.OneToOneField(
        "Bean",                  # string, so definition order doesn't matter
        null=True, blank=True,
        on_delete=models.CASCADE,
        related_name="bag_vessel",
    )
    visual_identifier = models.CharField(max_length=200, null=True, blank=True)
    vessel_type = models.ForeignKey(
        VesselType,
        on_delete=models.PROTECT
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["vessel_type__name", "visual_identifier"]  # default sort order
        verbose_name_plural = "vessels"                   # label in admin
        constraints = [
            models.UniqueConstraint(
                fields=['visual_identifier', 'vessel_type'], 
                name='visual_identifier_per_vessel_type'
            )
        ]

    def clean(self):
        if not self.vessel_type_id:
            return
        if not self.visual_identifier and self.vessel_type.has_identifier is True:
            raise ValidationError("Invalid vessel. Type rule says associated Vessels requires an identifier.")
        if self.visual_identifier and self.vessel_type.has_identifier is False:
            raise ValidationError("Invalid vessel. Type rule says associated Vessels cannot have an identifier.")

    def __str__(self):
        if not self.visual_identifier:
            return f"{self.vessel_type.name}"
        return f"{self.vessel_type.name} – {self.visual_identifier}"

class Process(models.Model):
    name = models.CharField(max_length=200, unique=True)

    class Meta:
        verbose_name_plural = 'processes'

    def __str__(self):
        return self.name

class Countries(models.Model):
    name = models.CharField(max_length=200, unique=True)
    iso_code = models.IntegerField(unique=True, null=True)

    def __str__(self):
        return self.name

class Region(models.Model):
    name = models.CharField(max_length=200)
    identifier_code = models.CharField(max_length=200)
    country = models.ForeignKey(
        Countries,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.name} – Country: ({self.country.name}) ID Code: {self.identifier_code}"

class Roaster(models.Model):
    name = models.CharField(max_length=200, unique=True)
    business_type = models.CharField(max_length=80, blank=True, choices=BusinessType.choices)
    website = models.URLField(blank=True, null=True)
    social = models.CharField(max_length=200, blank=True)
    notes = models.CharField(max_length=2000, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)

    address = models.CharField(max_length=300, blank=True)
    city = models.CharField(max_length=200, blank=True)
    region = models.ForeignKey(
        Region,
        on_delete=models.SET_NULL, 
        null=True
    ) 

    country = models.ForeignKey(
        Countries,
        on_delete=models.SET_NULL, 
        null=True
    ) 
    short_id = models.CharField(max_length=10, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.short_id:
            self.short_id = nanoid.generate(size=8)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-date_added']

    def __str__(self):
        return self.name

class Cultivar(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name

class Species(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name

class FlavorNotes(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name

class Bean(models.Model):
    name = models.CharField(max_length=200)        
    roaster = models.ForeignKey(
        Roaster,
        on_delete=models.CASCADE,
        related_name="beans",
    ) 
    origin_country = models.ForeignKey(
        Countries,
        on_delete=models.SET_NULL, 
        null=True,
        blank=True,
    ) 
    process = models.ForeignKey(
        Process,
        on_delete=models.SET_NULL, 
        null=True,
        blank=True,
    ) 
    roast_level = roast_level = models.CharField(max_length=50, blank=True, null=True, choices=RoastLevel.choices)
    organic_or_not = models.CharField(max_length=20, blank=True, choices=OrganicOrNot.choices)
    caff_or_decaf = models.CharField(max_length=20, choices=CaffOrDecaf.choices)
    purchase_date = models.DateField(null=True, blank=True)
    roast_date = models.DateField(null=True, blank=True)
    opened_date = models.DateTimeField(null=True, blank=True)
    finished = models.BooleanField(default=False)
    min_elevation = models.IntegerField(null=True, blank=True)
    max_elevation = models.IntegerField(null=True, blank=True)
    flavor_notes = models.ManyToManyField(FlavorNotes, null=True, blank=True, related_name="beans")
    comments = models.TextField(blank=True, null=True)
    short_id = models.CharField(max_length=10, unique=True, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)
    purchased = models.BooleanField(default=True)
    bag_weight = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    used_weight = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    species = models.ManyToManyField(Species, null=True, blank=True, related_name="beans")
    cultivars = models.ManyToManyField(Cultivar, null=True, blank=True, related_name="beans")

    @property
    def had_as_drink(self):
        return self.cafelog_set.exists()

    def save(self, *args, **kwargs):
        if not self.short_id:
            self.short_id = nanoid.generate(size=8)

        # Finishing is logged per lot (close_lot writes the FINISHED event); the bean just follows.
        super().save(*args, **kwargs)

    def recalculate_used_weight(self):
        from brew.models import EspressoDetail, AeropressDetail, PouroverDetail, ColdBrewDetail, CuppingDetail

        total = Decimal('0')
        for model in [EspressoDetail, AeropressDetail, PouroverDetail, ColdBrewDetail, CuppingDetail]:
            total += model.objects.filter(brew_log__bean=self).aggregate(
                total=Sum('weight')
            )['total'] or Decimal('0')

        self.used_weight = total
        self.save(update_fields=['used_weight'])

    @property
    def remaining_weight(self):
        return (self.bag_weight or Decimal('0')) - (self.used_weight or Decimal('0'))

    class Meta:
        ordering = ['-date_added']

    def __str__(self):
        return f"{self.roaster} – {self.name}"


class Drink(models.Model):
    roaster = models.ForeignKey(
        Roaster,
        on_delete=models.CASCADE,
    )
    venue = models.ForeignKey(
        Roaster,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='drinks_hosted',
    )
    bean = models.ForeignKey(
        Bean,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    drink = models.CharField(max_length=200)
    rating = models.IntegerField(null=True, blank=True)
    notes = models.CharField(max_length=2000, blank=True)
    drink_date = models.DateField()
    short_id = models.CharField(max_length=10, unique=True, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.short_id:
            self.short_id = nanoid.generate(size=8)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-date_added']

    def __str__(self):
        return f"{self.roaster} – {self.drink} ({self.drink_date})"

class MapZone(models.Model):
    zone_name = models.CharField(max_length=100, blank=False)
    countries = models.ManyToManyField(Countries)

    def __str__(self):
        return f"{self.zone_name} ID: {self.id}"

class CloseReason(models.Model):
    name = models.CharField(max_length=200, unique=True)
    carries_weight = models.BooleanField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class LotSplit(models.Model):
    bean = models.ForeignKey(
        Bean,
        null=False, 
        blank=False,
        on_delete=models.PROTECT,
    )
    vessel = models.ForeignKey(
        Vessel,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        verbose_name="Storage Vessel",
        help_text="Leave blank if in its original bag"
    )
    stored_weight = models.DecimalField(max_digits=7, decimal_places=2)
    remaining_weight = models.DecimalField(max_digits=7, decimal_places=2)
    leftover_weight = models.DecimalField(max_digits=7, decimal_places=2,null=True, blank=True)
    frozen_at = models.DateTimeField(null=True, blank=True)
    thawed_at = models.DateTimeField(null=True, blank=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    close_reason = models.ForeignKey(
        CloseReason,
        null=True,
        blank=True,
        on_delete=models.PROTECT
    )

    class Meta:
        ordering = ["bean__name","bean__purchase_date", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=['vessel'],
                name='single_vessel_const',
                condition=Q(closed_at__isnull=True)
            ),
            models.UniqueConstraint(
                fields=['bean'],
                name='one_unclosed_bag_lot_per_bean',
                condition=Q(vessel__isnull=True, closed_at__isnull=True),
            ),
            models.CheckConstraint(
                name='remaining_wt_is_lteq_stored_wt',
                condition=Q(remaining_weight__lte = F("stored_weight"))                
            ),
            models.CheckConstraint(
                name='remaining_wt_is_gteq_0',
                condition=Q(remaining_weight__gte = 0)                
            ),
            models.CheckConstraint(
                name='stored_wt_is_gt_0',
                condition=Q(stored_weight__gt = 0)                
            ),
            models.CheckConstraint(
                name='closed_at_and_reason_set_together',
                condition=Q(closed_at__isnull=True, close_reason__isnull=True) | Q(closed_at__isnull=False, close_reason__isnull=False)           
            ),
            models.CheckConstraint(
                name='thawed_at_after_frozen_at',
                condition=Q(thawed_at__isnull=True) | Q(frozen_at__isnull=False, thawed_at__gte = F("frozen_at"))        
            ),
            models.CheckConstraint(
                name='closed_at_after_opened_at',
                condition=Q(closed_at__isnull=True) | Q(opened_at__isnull=True) | Q(closed_at__gte = F("opened_at"))        
            ),

            # models.CheckConstraint(
            #     name='opened_at_after_thawed_at',
            #     condition=Q(opened_at__isnull=True) | Q(thawed_at__isnull=True, opened_at__gte = F("thawed_at"))        
            # ),
            # models.CheckConstraint(
            #     name='opened_at_after_frozen_at',
            #     condition=Q(opened_at__isnull=True) | Q(frozen_at__isnull=True, opened_at__gte = F("frozen_at"))        
            # ),

            # models.CheckConstraint(
            #     name='closed_at_after_frozen_at',
            #     condition=Q(closed_at__isnull=True) | Q(frozen_at__isnull=True, closedat_at__gte = F("frozen_at"))        
            # ),
            # models.CheckConstraint(
            #     name='closed_at_after_thawed_at',
            #     condition=Q(closed_at__isnull=True) | Q(thawed_at__isnull=True, closedat_at__gte = F("thawed_at"))        
            # ),
        ]

    def clean(self):
        errors = {}

        # Dates
        if self.thawed_at and not self.frozen_at:
            errors["thawed_at"] = "Needs a freeze date."
        if self.frozen_at and self.thawed_at and self.thawed_at < self.frozen_at:
            errors["thawed_at"] = "Can't be before the freeze date."
        if self.opened_at and self.frozen_at:
            if not self.thawed_at:
                errors["opened_at"] = "Frozen lot needs a thaw date before opening."
            elif self.thawed_at > self.opened_at:
                errors["opened_at"] = "Can't be before the thaw date."
        if self.closed_at:
            if self.opened_at and self.closed_at < self.opened_at:
                errors["closed_at"] = "Can't be before the open date."
            if self.thawed_at and self.closed_at < self.thawed_at:
                errors["closed_at"] = "Can't be before the thaw date."
            if self.frozen_at and self.closed_at < self.frozen_at:
                errors["closed_at"] = "Can't be before the freeze date."
            if not self.close_reason:
                errors["close_reason"] = "Add a close reason."
        elif self.close_reason:
            errors["closed_at"] = "Add a close date."

        # Roast floor
        roast_floor = self._roast_floor()
        if roast_floor is not None:
            if self.frozen_at and self.frozen_at < roast_floor:
                errors["frozen_at"] = "Can't be before the roast date."
            if self.opened_at and self.opened_at < roast_floor:
                errors["opened_at"] = "Can't be before the roast date."

        # Weights
        if self.stored_weight is not None and self.stored_weight <= 0:
            errors["stored_weight"] = "Must be above 0."
        if self.stored_weight is not None and self.remaining_weight is not None:
            if self.remaining_weight < 0:
                errors["remaining_weight"] = "Can't be negative."
            elif self.remaining_weight > self.stored_weight:
                errors["remaining_weight"] = "Can't exceed stored weight."
        if self.leftover_weight is not None and self.leftover_weight <= 0:
                errors["leftover_weight"] = "If giving leftover weight, must be greater than 0. Otherwise make it null."

        # Vessel Audit
        if self.vessel:
            if self._state.adding and not self.vessel.is_active:
                errors["vessel"] = "This vessel is retired."
            if not self.vessel.vessel_type.freezable:
                if bool(self.frozen_at) != bool(self.thawed_at):
                    errors["vessel"] = "Needs both freeze and thaw dates, or neither."

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        where = self.vessel or "Original bag"
        return f"{self.bean.name}: {where}"

    def _roast_floor(self):
        roast = self.bean.roast_date           
        if roast is None:
            return None
        return timezone.make_aware(datetime.combine(roast, time.min))

    def earliest_for(self, kind):
        """(timestamp, reason) this step must not precede, or (None, None)."""
        if kind == "freeze":
            return self._roast_floor(), "Roast date"
        if kind == "thaw":
            return self.frozen_at, "Frozen"
        if kind == "open":
            if self.thawed_at:
                return self.thawed_at, "Thawed"
            return self._roast_floor(), "Roast date"
        if kind == "close":
            set_dates = [
                (stamp, label)
                for stamp, label in (
                    (self.frozen_at, "Frozen"),
                    (self.thawed_at, "Thawed"),
                    (self.opened_at, "Opened"),
                )
                if stamp is not None
            ]
            if set_dates:
                return max(set_dates, key=lambda pair: pair[0])
            return self._roast_floor(), "Roast date"
        return None, None
