from django.db import models

class CaffOrDecaf(models.TextChoices):
    CAFFEINATED = 'caffeinated', 'Caffeinated'
    DECAF = 'decaffeinated', 'Decaffeinated'

class WashingStyle(models.TextChoices):
    WASHED = 'washed', 'Washed'
    NATURAL = 'natural', 'Natural'
    HONEY = 'honey', 'Honey'
    WASHED_NATURAL = 'washed_natural', 'Washed & Natural'
    ANAEROBIC_NATURAL = 'anaerobic_natural', 'Anaerobic Natural'
    ANAEROBIC_WASHED = 'anaerobic_washed', 'Anaerobic Washed'
    
class OrganicOrNot(models.TextChoices):
    ORGANIC = 'organic', 'Organic'
    NOT_ORGANIC = 'not_organic', 'Not Organic'

class BusinessType(models.TextChoices):
    ROASTER = 'roaster', 'Roaster'
    CAFE = 'cafe', 'Cafe'
    ROASTER_CAFE = 'roaster_cafe', 'Roaster/Cafe'

class RoastLevel(models.TextChoices):
    LIGHT = 'light', 'Light'
    LIGHT_MEDIUM = 'light_medium', 'Light-Medium'
    MEDIUM = 'medium', 'Medium'
    MEDIUM_DARK = 'medium_dark', 'Medium-Dark'
    DARK = 'dark', 'Dark'
