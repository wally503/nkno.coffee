from rest_framework.routers import DefaultRouter   
from .views import RoasterViewSet, BeanViewSet, CafeLogViewSet, CountriesViewSet

router = DefaultRouter()


router.register('roasters', RoasterViewSet)
router.register('beans', BeanViewSet)
router.register('cafelog', CafeLogViewSet)
router.register('countries', CountriesViewSet)

urlpatterns = router.urls
