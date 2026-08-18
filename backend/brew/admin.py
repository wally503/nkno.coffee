# brew/admin.py

from django.contrib import admin
from .models import (
    Grinder, Scale, Kettle,
    BrewLog,
    AeropressDetail, HoffmannEvent,
    PouroverDetail, PouroverPourEvent,
    ColdBrewDetail, BagLifecycleEvent,
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


admin.site.register(Grinder)
admin.site.register(Scale)
admin.site.register(Kettle)
admin.site.register(BrewLog, BrewLogAdmin)
admin.site.register(AeropressDetail, AeropressDetailAdmin)
admin.site.register(PouroverDetail, PouroverDetailAdmin)
admin.site.register(ColdBrewDetail)
admin.site.register(BagLifecycleEvent)