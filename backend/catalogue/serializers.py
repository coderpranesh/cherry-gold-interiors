#backend/catalogue/serializers.py
from rest_framework import serializers
from .models import (
    CatalogueCategory,
    CatalogueItem,
    ColorOption,
    RoomType,
    CatalogueImage,
)

class RoomTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomType
        fields = ['id', 'name', 'slug']

class CatalogueCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CatalogueCategory
        fields = ['id', 'name', 'slug', 'description', 'image']

class ColorOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColorOption
        fields = ['id', 'name', 'color_code', 'image', 'additional_price']

class CatalogueImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CatalogueImage
        fields = ['id', 'image', 'caption', 'is_primary']

class CatalogueItemSerializer(serializers.ModelSerializer):
    category = CatalogueCategorySerializer(read_only=True)
    room_types = RoomTypeSerializer(many=True, read_only=True)
    color_options = ColorOptionSerializer(many=True, read_only=True)
    additional_images = CatalogueImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = CatalogueItem
        fields = [
            'id', 'name', 'slug', 'category', 'room_types', 'base_price',
            'description', 'main_image', 'is_featured', 'created_at',
            'color_options', 'additional_images'
        ]
        lookup_field = 'slug'
        extra_kwargs = {
            'url': {'lookup_field': 'slug'}
        }

class CatalogueItemListSerializer(serializers.ModelSerializer):
    category = CatalogueCategorySerializer(read_only=True)
    
    class Meta:
        model = CatalogueItem
        fields = ['id', 'name', 'slug', 'category', 'main_image', 'base_price', 'is_featured']
        lookup_field = 'slug'
        extra_kwargs = {
            'url': {'lookup_field': 'slug'}
        }

class CatalogueSearchSerializer(serializers.Serializer):
    query = serializers.CharField(max_length=100)
    category = serializers.CharField(required=False)
    room_type = serializers.CharField(required=False)
    min_price = serializers.DecimalField(required=False, max_digits=10, decimal_places=2)
    max_price = serializers.DecimalField(required=False, max_digits=10, decimal_places=2)