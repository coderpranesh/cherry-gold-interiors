# backend/portfolio/urls.py

from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    PortfolioItemViewSet,
    CategoryListView,
    FeaturedPortfolioView,
    CaseStudyDetailView,
)

# Router for PortfolioItem CRUD (list, retrieve, create, update, delete)
router = DefaultRouter()
router.register(r'items', PortfolioItemViewSet, basename='portfolioitem')

urlpatterns = [
    # GET: /api/portfolio/categories/ — List all portfolio categories
    path('categories/', CategoryListView.as_view(), name='category-list'),

    # GET: /api/portfolio/featured/ — List all featured portfolio items
    path('featured/', FeaturedPortfolioView.as_view(), name='featured-portfolio'),

    # GET: /api/portfolio/case-studies/<pk>/ — Retrieve specific case study by ID
    path('case-studies/<int:pk>/', CaseStudyDetailView.as_view(), name='case-study-detail'),
]

# Router-generated endpoints:
# GET    /api/portfolio/items/         — list all items
# POST   /api/portfolio/items/         — create new item
# GET    /api/portfolio/items/<slug>/  — retrieve item by slug
# PUT    /api/portfolio/items/<slug>/  — update item
# DELETE /api/portfolio/items/<slug>/  — delete item
urlpatterns += router.urls
