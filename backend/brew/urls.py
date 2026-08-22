# brew/urls.py

from rest_framework.routers import DefaultRouter
from .views import (
    GrinderViewSet, ScaleViewSet, KettleViewSet,
    BrewLogViewSet,
    AeropressDetailViewSet, PouroverDetailViewSet, ColdBrewDetailViewSet,
    EspressoDetailViewSet
)

router = DefaultRouter()
router.register('grinders', GrinderViewSet)
router.register('scales', ScaleViewSet)
router.register('kettles', KettleViewSet)
router.register('brewlogs', BrewLogViewSet)
router.register('aeropress', AeropressDetailViewSet)
router.register('pourover', PouroverDetailViewSet)
router.register('coldbrew', ColdBrewDetailViewSet)
router.register('espresso', EspressoDetailViewSet)

urlpatterns = router.urls