from django.db import models
from .choices import CaffOrDecaf, WashingStyle, OrganicOrNot, BusinessType, RoastLevel

# Create your models here.

class Countries(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name

class Roaster(models.Model):
    name = models.CharField(max_length=200, unique=True)
    business_type = models.CharField(max_length=80, blank=True, choices=BusinessType.choices)
    website = models.URLField(blank=True, null=True)
    social = models.CharField(max_length=200, blank=True)
    notes = models.CharField(max_length=2000, blank=True)

    address = models.CharField(max_length=300, blank=True)
    city = models.CharField(max_length=200, blank=True)
    state_region = models.CharField(max_length=200, blank=True)
    country = models.ForeignKey(
        Countries,
        on_delete=models.SET_NULL, 
        null=True
    ) 

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
    roast_level = models.CharField(max_length=50, blank=True, choices=RoastLevel.choices)
    organic_or_not = models.CharField(max_length=20, blank=True, choices=OrganicOrNot.choices)
    washing_style = models.CharField(max_length=50, blank=True, choices=WashingStyle.choices)
    caff_or_decaf = models.CharField(max_length=20, choices=CaffOrDecaf.choices)
    purchase_date = models.DateField(null=True, blank=True)
    roast_date = models.DateField(null=True, blank=True)
    min_elevation = models.IntegerField(null=True, blank=True)
    max_elevation = models.IntegerField(null=True, blank=True)
    flavor_notes = models.ManyToManyField(FlavorNotes, null=True, blank=True, related_name="beans")

    def __str__(self):
        return f"{self.roaster} – {self.name}"


class CafeLog(models.Model):
    roaster = models.ForeignKey(
        Roaster,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
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
    logged_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.roaster} – {self.drink} ({self.logged_at.date()})"