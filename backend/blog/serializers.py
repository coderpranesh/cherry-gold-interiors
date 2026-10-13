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
    title = serializers.CharField(read_only=True)
    author = serializers.SerializerMethodField()
    category = BlogCategorySerializer(read_only=True)
    tags = BlogTagSerializer(many=True, read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'author', 'category', 'tags',
            'excerpt', 'cover_image', 'published_date', 'slug'
        ]

    def get_author(self, obj):
        return {
            'username': 'cherrygold',
            'first_name': 'Cherry Gold',
            'last_name': 'Interiors'
        }

# Detailed serializer for a single blog post
class BlogPostDetailSerializer(serializers.ModelSerializer):
    title = serializers.CharField(read_only=True)
    content = serializers.CharField(read_only=True)
    author = serializers.SerializerMethodField()
    category = BlogCategorySerializer(read_only=True)
    tags = BlogTagSerializer(many=True, read_only=True)
    meta_title = serializers.SerializerMethodField()
    meta_description = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'author', 'category', 'tags',
            'excerpt', 'content', 'cover_image', 'status',
            'published_date', 'created_at', 'updated_at',
            'meta_title', 'meta_description', 'slug'
        ]

    def get_author(self, obj):
        return {
            'username': 'cherrygold',
            'first_name': 'Cherry Gold',
            'last_name': 'Interiors'
        }

    def get_meta_title(self, obj):
        return getattr(obj, 'title', '') or ''

    def get_meta_description(self, obj):
        return getattr(obj, 'excerpt', '') or ''

# Serializer for search/filtering posts
class BlogSearchSerializer(serializers.Serializer):
    query = serializers.CharField(max_length=100)
    category = serializers.CharField(required=False)
    tag = serializers.CharField(required=False)
    year = serializers.IntegerField(required=False)
    month = serializers.IntegerField(required=False, min_value=1, max_value=12)
