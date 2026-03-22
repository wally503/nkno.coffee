from django.db import models

class CaffOrDecaf(models.TextChoices):
    CAFFEINATED = 'caffeinated', 'Caffeinated'
    DECAF = 'decaffeinated', 'Decaffeinated'

class WashingStyle(models.TextChoices):
    WASHED = 'washed', 'Washed'
    NATURAL = 'natural', 'Natural'
    FERMENTED = 'fermented', 'Fermented'
    HONEY = 'honey', 'Honey'

class OrganicOrNot(models.TextChoices):
    ORGANIC = 'organic', 'Organic'
    NOT_ORGANIC = 'not_organic', 'Not Organic'

class BusinessType(models.TextChoices):
    ROASTER = 'roaster', 'Roaster'
    CAFE = 'cafe', 'Cafe'

class RoastLevel(models.TextChoices):
    LIGHT = 'light', 'Light'
    LIGHT_MEDIUM = 'light_medium', 'Light-Medium'
    MEDIUM = 'medium', 'Medium'
    MEDIUM_DARK = 'medium_dark', 'Medium-Dark'
    DARK = 'dark', 'Dark'
