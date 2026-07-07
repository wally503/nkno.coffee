from django.contrib import admin
from .models import (
    Water, Cup, BrewMethod, BrewTool, BrewVessel, VesselSetting,
    Grinder, GrinderSetting, BrewRecipie, BrewStep, BrewSession,
    SessionAdjustment, BrewRecipieVesselSetting, BrewRecipieGrinderSetting,
    BrewRecipieBrewTool, BrewMethodDispatch
)

admin.site.register(Water)
admin.site.register(Cup)
admin.site.register(BrewMethod)
admin.site.register(BrewTool)
admin.site.register(BrewVessel)
admin.site.register(VesselSetting)
admin.site.register(Grinder)
admin.site.register(GrinderSetting)
admin.site.register(BrewRecipie)
admin.site.register(BrewStep)
admin.site.register(BrewSession)
admin.site.register(SessionAdjustment)
admin.site.register(BrewRecipieVesselSetting)
admin.site.register(BrewRecipieGrinderSetting)
admin.site.register(BrewRecipieBrewTool)
admin.site.register(BrewMethodDispatch)