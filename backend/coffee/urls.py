from rest_framework.routers import DefaultRouter   
from .views import RoasterViewSet, BeanViewSet, CafeLogViewSet, CountriesViewSet, FlavorNotesViewSet

router = DefaultRouter()


router.register('roasters', RoasterViewSet)
router.register('beans', BeanViewSet)
router.register('cafelog', CafeLogViewSet)
router.register('countries', CountriesViewSet)
router.register('notes', FlavorNotesViewSet)

urlpatterns = router.urls
