from rest_framework import serializers
from .models import (
    PortfolioItem,
    PortfolioImage,
    PortfolioVideo,
    CaseStudy,
    PortfolioFeature,
    PortfolioMaterial
)


class PortfolioImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioImage
        fields = ['id', 'image', 'caption', 'order']


class PortfolioVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioVideo
        fields = ['id', 'video_url', 'caption', 'order']


class CaseStudySerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseStudy
        fields = [
            'id', 'title', 'content',
            'before_image', 'after_image',
            'challenges', 'solutions',
            'created_at'
        ]


class PortfolioFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioFeature
        fields = ['feature']


class PortfolioMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioMaterial
        fields = ['material']


class PortfolioItemSerializer(serializers.ModelSerializer):
    gallery = PortfolioImageSerializer(many=True, read_only=True)
    videos = PortfolioVideoSerializer(many=True, read_only=True)
    case_studies = CaseStudySerializer(many=True, read_only=True)
    features = PortfolioFeatureSerializer(many=True, read_only=True)
    materials = PortfolioMaterialSerializer(many=True, read_only=True)

    class Meta:
        model = PortfolioItem
        fields = [
            'id',
            'title',
            'slug',
            'category',
            'location',
            'description',
            'detailed_description',
            'completion_time',
            'budget',
            'main_image',
            'is_featured',
            'created_at',
            'gallery',
            'features',
            'materials',
            'videos',
            'case_studies',
        ]
        lookup_field = 'slug'
        extra_kwargs = {
            'url': {'lookup_field': 'slug'}
        }



class PortfolioItemListSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = [
            'id',
            'title',
            'slug',
            'category',
            'location',
            'description',
            'main_image',
            'budget',
            'completion_time',
            'is_featured',
            'created_at'
        ]
        lookup_field = 'slug'
        extra_kwargs = {
            'url': {'lookup_field': 'slug'}
        }
