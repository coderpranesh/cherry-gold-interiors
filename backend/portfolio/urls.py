from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    PortfolioItemViewSet,
    CategoryListView,
    FeaturedPortfolioView,
    CaseStudyDetailView,
)

router = DefaultRouter()
router.register(r'items', PortfolioItemViewSet, basename='portfolioitem')

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('featured/', FeaturedPortfolioView.as_view(), name='featured-portfolio'),
    path('case-studies/<int:pk>/', CaseStudyDetailView.as_view(), name='case-study-detail'),
] + router.urls