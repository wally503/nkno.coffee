from django.db import models

# Create your models here.

class Roaster(models.Model):
    name = models.CharField(max_length=200, unique=True)
    business_type = models.CharField(max_length=80, blank=True)
    website = models.URLField(blank=True, null=True)
    social = models.CharField(max_length=200, blank=True)
    notes = models.CharField(max_length=2000, blank=True)

    address = models.CharField(max_length=300)
    city = models.CharField(max_length=200)
    state_region = models.CharField(max_length=200)
    country = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class OriginCountry(models.Model):
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
        OriginCountry,
        on_delete=models.SET_NULL, 
        null=True,
        blank=True,
    ) 
    roast_level = models.CharField(max_length=50, blank=True)
    organic_or_not = models.BooleanField(default=False)
    washing_style = models.CharField(max_length=50, blank=True)
    caff_or_decaf = models.CharField(max_length=20, default="Caffeinated")
    roast_date = models.DateField(null=True, blank=True)
    min_elevation = models.IntegerField(null=True, blank=True)
    max_elevation = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.roaster} – {self.name}"


