from django.db import models
# from .choices import CaffOrDecaf, WashingStyle, OrganicOrNot, BusinessType, RoastLevel
import nanoid


class Water(models.Model):
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=500)

    def __str__(self):
        return f"{self.name} – {self.description}"

class Cup(models.Model):
    name = models.CharField(max_length=200)
    material = models.CharField(max_length=200)
    capacity = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.name} – material: {self.material} - capacity: {self.capacity}"


class BrewMethod(models.Model):
    name = models.CharField(max_length=200)
    is_dormant = models.BooleanField()

    def __str__(self):
        return f"{self.name} – dormant state: {self.is_dormant}"

class BrewTool(models.Model):
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.name} – {self.description}"


class BrewVessel(models.Model):
    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.name} – {self.brand}"

class VesselSetting(models.Model):
    name = models.CharField(max_length=200)
    setting_name = models.CharField(max_length=200)
    description = models.CharField(max_length=500)
    vessel = models.ForeignKey(
        BrewVessel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.name} – {self.setting_name}"


class Grinder(models.Model):
    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.name} – {self.brand}"

class GrinderSetting(models.Model):
    name = models.CharField(max_length=200)
    setting_name = models.CharField(max_length=200)
    description = models.CharField(max_length=500)
    grinder = models.ForeignKey(
        Grinder,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.name} – {self.setting_name}"



class BrewRecipie(models.Model):
    dose_grams = models.IntegerField(null=False, blank=False)
    water_grams = models.IntegerField(null=False, blank=False)
    markup = models.TextField(max_length=200)
    name = models.TextField(max_length=200)

    grinder = models.ForeignKey(
        Grinder,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    vessel = models.ForeignKey(
        BrewVessel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    method = models.ForeignKey(
        BrewMethod,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    water = models.ForeignKey(
        Water,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    cup = models.ForeignKey(
        Cup,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.id} – {self.name} - method: {self.method.name}"


class BrewStep(models.Model):
    order = models.IntegerField(null=False, blank=False)
    duration_seconds = models.IntegerField(null=False, blank=False)
    step_type = models.TextField(max_length=200)
    amount = models.TextField(max_length=200)
    notes = models.TextField(max_length=1000)

    recipie = models.ForeignKey(
        BrewRecipie,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.id} – recipie: {self.recipie.name} - steptype: {self.step_type}"


class BrewSession(models.Model):
    rating = models.IntegerField(null=True, blank=True)
    notes = models.TextField(max_length=1000)
    date = models.DateField(null=True, blank=True)

    recipie = models.ForeignKey(
        BrewRecipie,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.id} – {self.recipie.name}"

class SessionAdjustment(models.Model):
    parameter_source = models.TextField(max_length=200)
    display_token = models.TextField(max_length=200)
    expected_value = models.TextField(max_length=200)
    actual_value = models.TextField(max_length=200)
    reason = models.TextField(max_length=1000)

    session = models.ForeignKey(
        BrewSession,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.id} – {self.parameter_source} / {self.session.recipie.name}"


class BrewRecipieVesselSetting(models.Model):
    value = models.TextField(max_length=200)
    vessel_setting = models.ForeignKey(
        VesselSetting,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    recipie = models.ForeignKey(
        BrewRecipie,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.id} – {self.recipie} - {self.value}"

class BrewRecipieGrinderSetting(models.Model):
    value = models.TextField(max_length=200)
    grinder_setting = models.ForeignKey(
        GrinderSetting,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    recipie = models.ForeignKey(
        BrewRecipie,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.id} – {self.recipie} - {self.value}"


class BrewRecipieBrewTool(models.Model):
    value = models.TextField(max_length=200)
    recipie = models.ForeignKey(
        BrewRecipie,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    brew_tool = models.ForeignKey(
        BrewTool,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.id} – tool: {self.brew_tool.name} - recipie: {self.recipie.name}"


class BrewMethodDispatch(models.Model):
    target_table = models.CharField(max_length=200)
    method = models.ForeignKey(
        BrewMethod,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.id} – {self.target_table}"