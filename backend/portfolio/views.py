from rest_framework import viewsets, generics
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import PortfolioItem, CaseStudy
from .serializers import (
    PortfolioItemSerializer,
    PortfolioItemListSerializer,
    CaseStudySerializer
)


class PortfolioItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Portfolio items.
    - GET /api/portfolio/ -> list
    - GET /api/portfolio/<slug>/ -> detail
    - Supports category & featured filters
    """
    queryset = PortfolioItem.objects.all()
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return PortfolioItemListSerializer
        return PortfolioItemSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')

        if category:
            queryset = queryset.filter(category=category)
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)

        return queryset


class CategoryListView(generics.GenericAPIView):
    """
    Returns list of portfolio categories.
    Useful for frontend dropdowns/filters.
    """
    def get(self, request):
        categories = [
            {'value': choice[0], 'label': choice[1]}
            for choice in PortfolioItem.CATEGORY_CHOICES
        ]
        return Response(categories)


class FeaturedPortfolioView(generics.ListAPIView):
    """
    Returns all featured portfolio items.
    """
    serializer_class = PortfolioItemListSerializer
    queryset = PortfolioItem.objects.filter(is_featured=True)
    pagination_class = None


class CaseStudyDetailView(generics.RetrieveAPIView):
    """
    Get details of a specific case study.
    """
    queryset = CaseStudy.objects.all()
    serializer_class = CaseStudySerializer
    lookup_field = 'pk'
