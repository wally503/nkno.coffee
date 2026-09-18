from rest_framework.routers import DefaultRouter   
from .views import RoasterViewSet, BeanViewSet, DrinkViewSet, CountriesViewSet, FlavorNotesViewSet, RegionsViewSet, MapzoneViewSet, BeanLifecycleViewSet,OpenBagListView
from django.urls import path

router = DefaultRouter()


router.register('roasters', RoasterViewSet)
router.register('beans', BeanViewSet)
router.register('regions', RegionsViewSet)
router.register('drinks', DrinkViewSet)
router.register('countries', CountriesViewSet)
router.register('notes', FlavorNotesViewSet)
router.register('mapzone', MapzoneViewSet)
router.register('beanLifecycle', BeanLifecycleViewSet, basename='bean-lifecycle') 


urlpatterns = [
    path('beans/open/', OpenBagListView.as_view(), name='open-bags'),    
] + router.urls 