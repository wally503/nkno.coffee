from rest_framework.routers import DefaultRouter   
from .views import RoasterViewSet, BeanViewSet, DrinkViewSet, CountriesViewSet, FlavorNotesViewSet, RegionsViewSet

router = DefaultRouter()


router.register('roasters', RoasterViewSet)
router.register('beans', BeanViewSet)
router.register('regions', RegionsViewSet)
router.register('drinks', DrinkViewSet)
router.register('countries', CountriesViewSet)
router.register('notes', FlavorNotesViewSet)

urlpatterns = router.urls
