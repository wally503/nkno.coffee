# brew/urls.py
from rest_framework.routers import DefaultRouter
from .views import GrinderViewSet, BrewVesselViewSet

router = DefaultRouter()
router.register('grinders', GrinderViewSet)
router.register('vessels', BrewVesselViewSet)

urlpatterns = router.urls