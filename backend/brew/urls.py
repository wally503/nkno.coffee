# brew/urls.py
from rest_framework.routers import DefaultRouter
from .views import ( 
    GrinderViewSet, BrewVesselViewSet, WaterViewSet, CupViewSet,
    BrewMethodViewSet, BrewToolViewSet, GrinderSettingViewSet, VesselSettingViewSet,
    RecipieTemplateViewSet, RecipieViewSet
)

router = DefaultRouter()
router.register('grinders', GrinderViewSet)
router.register('vessels', BrewVesselViewSet)
router.register('waters', WaterViewSet)
router.register('cups', CupViewSet)
router.register('methods', BrewMethodViewSet)
router.register('tools', BrewToolViewSet)
router.register('grindersettings', GrinderSettingViewSet)
router.register('vesselsettings', VesselSettingViewSet)
router.register('recipies', RecipieViewSet)
router.register('recipietemplates', RecipieTemplateViewSet)

urlpatterns = router.urls