from rest_framework import serializers
from .models import PortfolioItem, PortfolioImage, PortfolioVideo, CaseStudy

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
        fields = ['id', 'title', 'content', 'before_image', 'after_image', 'challenges', 'solutions', 'created_at']

class PortfolioItemSerializer(serializers.ModelSerializer):
    images = PortfolioImageSerializer(many=True, read_only=True)
    videos = PortfolioVideoSerializer(many=True, read_only=True)
    case_studies = CaseStudySerializer(many=True, read_only=True)
    
    class Meta:
        model = PortfolioItem
        fields = [
            'id', 'title', 'slug', 'category', 'description', 'main_image', 
            'is_featured', 'created_at', 'images', 'videos', 'case_studies'
        ]
        lookup_field = 'slug'
        extra_kwargs = {
            'url': {'lookup_field': 'slug'}
        }

class PortfolioItemListSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = ['id', 'title', 'slug', 'category', 'main_image', 'is_featured', 'created_at']
        lookup_field = 'slug'
        extra_kwargs = {
            'url': {'lookup_field': 'slug'}
        }