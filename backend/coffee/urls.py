from rest_framework.routers import DefaultRouter   
from .views import RoasterViewSet, BeanViewSet, DrinkViewSet, CountriesViewSet, FlavorNotesViewSet, RegionsViewSet, MapzoneViewSet, BeanLifecycleViewSet,OpenBagListView, ProcessesViewSet
from django.urls import path
from coffee.lots_api import LotSplitViewSet
from brew.events_api import LifecycleEventViewSet

router = DefaultRouter()


router.register('roasters', RoasterViewSet)
router.register('beans', BeanViewSet)
router.register('regions', RegionsViewSet)
router.register('drinks', DrinkViewSet)
router.register('countries', CountriesViewSet)
router.register('notes', FlavorNotesViewSet)
router.register('mapzone', MapzoneViewSet)
router.register('process', ProcessesViewSet)
router.register('beanLifecycle', BeanLifecycleViewSet, basename='bean-lifecycle') 

router.register("lots", LotSplitViewSet, basename="lot")
router.register("lifecycle-events", LifecycleEventViewSet, basename="lifecycle-event")

urlpatterns = [
    path('beans/open/', OpenBagListView.as_view(), name='open-bags'),    
] + router.urls 