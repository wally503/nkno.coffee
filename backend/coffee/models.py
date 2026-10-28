from django.db import models
from django.utils import timezone
from .choices import CaffOrDecaf, OrganicOrNot, BusinessType, RoastLevel
import nanoid
from decimal import Decimal
from django.db.models import Sum
from django.core.exceptions import ValidationError

class VesselType(models.Model):
    name = models.CharField(max_length=200, unique=True)
    has_identifier = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

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
    bag_weight = models.DecimalField(max_digits=6, decimal_places=1, null=True, blank=True)
    used_weight = models.DecimalField(max_digits=6, decimal_places=1, null=True, blank=True)

    @property
    def had_as_drink(self):
        return self.cafelog_set.exists()

    def save(self, *args, **kwargs):
        if not self.short_id:
            self.short_id = nanoid.generate(size=8)

        if self.pk:
            was_finished = Bean.objects.filter(pk=self.pk).values_list('finished', flat=True).first()
            just_finished = self.finished and not was_finished
        else:
            just_finished = False

        super().save(*args, **kwargs)

        if just_finished:
            from brew.models import BagLifecycleEvent
            BagLifecycleEvent.objects.create(
                bean=self,
                event_type=BagLifecycleEvent.EventType.FINISHED,
                date=getattr(self, '_finished_date', None) or timezone.now(),
            )

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

    @property
    def needs_bag_close_prompt(self):
        return self.remaining_weight <= 10 and not self.finished
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