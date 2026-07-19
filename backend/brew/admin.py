from django.contrib import admin
from .models import (
    Water, Cup, BrewMethod, BrewTool, BrewVessel, VesselSetting,
    Grinder, GrinderSetting, Recipie, RecipieTemplate, BrewStep, BrewSession,
    RecipieVesselSetting, RecipieGrinderSetting,
    RecipieBrewTool, BrewMethodDispatch
)

class RecipieAdmin(admin.ModelAdmin):
    save_as = True

class BrewSessionAdmin(admin.ModelAdmin):
    list_display = ("date", "bean", "recipie", "rating")
    list_filter = ("date", "recipie")
    search_fields = ("notes", "bean__name", "recipie__name")
    ordering = ("-date",)
    date_hierarchy = "date"
    list_per_page = 50
    # has dependancies, but is a viabilty
    # autocomplete_fields = ("bean",)

admin.site.register(Water)
admin.site.register(Cup)
admin.site.register(BrewMethod)
admin.site.register(BrewTool)
admin.site.register(BrewVessel)
admin.site.register(VesselSetting)
admin.site.register(Grinder)
admin.site.register(GrinderSetting)
admin.site.register(RecipieTemplate)
admin.site.register(Recipie, RecipieAdmin)
admin.site.register(BrewStep)
admin.site.register(BrewSession, BrewSessionAdmin)
admin.site.register(RecipieVesselSetting)
admin.site.register(RecipieGrinderSetting)
admin.site.register(RecipieBrewTool)
admin.site.register(BrewMethodDispatch)

