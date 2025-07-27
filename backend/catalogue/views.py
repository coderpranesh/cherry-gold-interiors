from rest_framework import viewsets, generics
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import (
    CatalogueCategory,
    CatalogueItem,
    RoomType,
)
from .serializers import (
    CatalogueCategorySerializer,
    CatalogueItemSerializer,
    CatalogueItemListSerializer,
    RoomTypeSerializer,
    CatalogueSearchSerializer,
)

class CatalogueItemViewSet(viewsets.ModelViewSet):
    queryset = CatalogueItem.objects.all()
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CatalogueItemListSerializer
        return CatalogueItemSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category', None)
        room_type = self.request.query_params.get('room_type', None)
        featured = self.request.query_params.get('featured', None)
        
        if category:
            queryset = queryset.filter(category__slug=category)
        if room_type:
            queryset = queryset.filter(room_types__slug=room_type)
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)
        
        return queryset

class CatalogueCategoryListView(generics.ListAPIView):
    queryset = CatalogueCategory.objects.all()
    serializer_class = CatalogueCategorySerializer
    pagination_class = None

class RoomTypeListView(generics.ListAPIView):
    queryset = RoomType.objects.all()
    serializer_class = RoomTypeSerializer
    pagination_class = None

class FeaturedItemsView(generics.ListAPIView):
    serializer_class = CatalogueItemListSerializer
    queryset = CatalogueItem.objects.filter(is_featured=True)
    pagination_class = None

class CatalogueSearchView(generics.GenericAPIView):
    serializer_class = CatalogueSearchSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        query = serializer.validated_data.get('query')
        category = serializer.validated_data.get('category')
        room_type = serializer.validated_data.get('room_type')
        min_price = serializer.validated_data.get('min_price')
        max_price = serializer.validated_data.get('max_price')
        
        queryset = CatalogueItem.objects.all()
        
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) | 
                Q(description__icontains=query)
            )
        
        if category:
            queryset = queryset.filter(category__slug=category)
        
        if room_type:
            queryset = queryset.filter(room_types__slug=room_type)
        
        if min_price:
            queryset = queryset.filter(base_price__gte=min_price)
        
        if max_price:
            queryset = queryset.filter(base_price__lte=max_price)
        
        serializer = CatalogueItemListSerializer(queryset, many=True)
        return Response(serializer.data)

class RoomTypeItemsView(generics.ListAPIView):
    serializer_class = CatalogueItemListSerializer
    
    def get_queryset(self):
        room_type = get_object_or_404(RoomType, slug=self.kwargs['slug'])
        return CatalogueItem.objects.filter(room_types=room_type)