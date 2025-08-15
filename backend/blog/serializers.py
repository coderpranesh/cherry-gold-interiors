from rest_framework import serializers
from .models import BlogPost, BlogCategory, BlogTag
from accounts.serializers import UserSerializer

# Serializer for blog tags
class BlogTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogTag
        fields = ['id', 'name', 'slug']

# Serializer for blog categories
class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug', 'description']

# Lightweight serializer for blog post list view
class BlogPostListSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = BlogCategorySerializer(read_only=True)
    tags = BlogTagSerializer(many=True, read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'author', 'category', 'tags',
            'excerpt', 'cover_image', 'published_date'
        ]

# Detailed serializer for a single blog post
class BlogPostDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = BlogCategorySerializer(read_only=True)
    tags = BlogTagSerializer(many=True, read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'author', 'category', 'tags',
            'excerpt', 'content', 'cover_image', 'status',
            'published_date', 'created_at', 'updated_at',
            'meta_title', 'meta_description'
        ]

# Serializer for search/filtering posts
class BlogSearchSerializer(serializers.Serializer):
    query = serializers.CharField(max_length=100)
    category = serializers.CharField(required=False)
    tag = serializers.CharField(required=False)
    year = serializers.IntegerField(required=False)
    month = serializers.IntegerField(required=False, min_value=1, max_value=12)
