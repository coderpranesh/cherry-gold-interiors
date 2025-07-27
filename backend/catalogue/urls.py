from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    CatalogueItemViewSet,
    CatalogueCategoryListView,
    RoomTypeListView,
    FeaturedItemsView,
    CatalogueSearchView,
    RoomTypeItemsView,
)

router = DefaultRouter()
router.register(r'items', CatalogueItemViewSet, basename='catalogueitem')

urlpatterns = [
    path('categories/', CatalogueCategoryListView.as_view(), name='category-list'),
    path('room-types/', RoomTypeListView.as_view(), name='room-type-list'),
    path('featured/', FeaturedItemsView.as_view(), name='featured-items'),
    path('search/', CatalogueSearchView.as_view(), name='catalogue-search'),
    path('room-types/<slug:slug>/', RoomTypeItemsView.as_view(), name='room-type-items'),
] + router.urls