# brew/admin.py

from django.contrib import admin
from .models import (
    Grinder, Scale, Kettle,
    BrewLog,
    AeropressDetail, HoffmannEvent,
    PouroverDetail, PouroverPourEvent,
    ColdBrewDetail, BagLifecycleEvent, EspressoDetail,
    BrewTag, CuppingDetail, LotBrewBridge
)


class BrewLogAdmin(admin.ModelAdmin):
    list_display = ("date", "bean", "style", "extraction_rating", "pull_number")
    list_filter = ("date", "style")
    search_fields = ("notes", "bean__name")
    ordering = ("-date",)
    date_hierarchy = "date"
    list_per_page = 50


class HoffmannEventInline(admin.TabularInline):
    model = HoffmannEvent
    extra = 1


class AeropressDetailAdmin(admin.ModelAdmin):
    inlines = [HoffmannEventInline]


class PouroverPourEventInline(admin.TabularInline):
    model = PouroverPourEvent
    extra = 1


class PouroverDetailAdmin(admin.ModelAdmin):
    inlines = [PouroverPourEventInline]

@admin.register(BrewTag)
class BrewTagAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "methods", "sort_order")
    list_filter = ("category",)

admin.site.register(Grinder)
admin.site.register(Scale)
admin.site.register(Kettle)
admin.site.register(BrewLog, BrewLogAdmin)
admin.site.register(AeropressDetail, AeropressDetailAdmin)
admin.site.register(PouroverDetail, PouroverDetailAdmin)
admin.site.register(ColdBrewDetail)

@admin.register(BagLifecycleEvent)
class BagLifecycleEventAdmin(admin.ModelAdmin):
    list_display = ["date", "bean", "event_type", "notes"]
    list_filter = ["event_type"]
    search_fields = ["bean__name", "notes"]
    ordering = ["-date"]
    date_hierarchy = "date"
    
admin.site.register(EspressoDetail)
admin.site.register(CuppingDetail)

@admin.register(LotBrewBridge)
class LotBrewBridgeAdmin(admin.ModelAdmin):
    list_display = ["brew", "lot", "grams", "is_closing"]
    list_filter = ["is_closing"]