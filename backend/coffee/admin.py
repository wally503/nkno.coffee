from django.contrib import admin
from .models import Bean, Roaster, Drink, Countries, FlavorNotes, Region, MapZone, Process, Vessel, VesselType, CloseReason, LotSplit

@admin.register(Bean)
class BeanAdmin(admin.ModelAdmin):
    list_display = ["name", "roaster", "purchase_date", "opened_date", "finished"]
    list_filter = ["finished", "roaster"]
    search_fields = ["name", "roaster__name"]
    ordering = ["-purchase_date"]
    
admin.site.register(Roaster)
admin.site.register(Drink)
admin.site.register(Countries)
admin.site.register(FlavorNotes)
admin.site.register(Region)
admin.site.register(MapZone)
admin.site.register(Process)
admin.site.register(Vessel) 
admin.site.register(VesselType)
admin.site.register(CloseReason) 



@admin.register(LotSplit)
class LotSplitAdmin(admin.ModelAdmin):
    list_display = ["bean", "vessel", "stored_weight", "remaining_weight",
                    "frozen_at", "thawed_at", "opened_at", "closed_at"]
    list_filter = ["vessel__vessel_type", "close_reason"]
    search_fields = ["bean__name"]
    fieldsets = [
        ("Where", {"fields": ["bean", "vessel"]}),
        ("Weights", {"fields": ["stored_weight", "remaining_weight"]}),
        ("Dates", {"fields": ["frozen_at", "thawed_at", "opened_at"]}),
        ("Close", {"fields": ["closed_at", "close_reason"], "classes": ["collapse"]}),
    ]