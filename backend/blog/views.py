from rest_framework import viewsets, generics
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from .models import BlogPost, BlogCategory, BlogTag
from .serializers import (
    BlogPostListSerializer,
    BlogPostDetailSerializer,
    BlogCategorySerializer,
    BlogTagSerializer,
    BlogSearchSerializer,
)

class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for listing and retrieving blog posts.
    Supports filters for category, tag, and featured posts.
    """
    lookup_field = 'slug' 
    def get_serializer_class(self):
        return BlogPostListSerializer if self.action == 'list' else BlogPostDetailSerializer
    

    def get_queryset(self):
        queryset = BlogPost.objects.filter(status__iexact='published').order_by('-published_date')
        category = self.request.query_params.get('category')
        tag = self.request.query_params.get('tag')
        featured = self.request.query_params.get('featured')

        if category:
            queryset = queryset.filter(category__slug=category)
        if tag:
            queryset = queryset.filter(tags__slug=tag)
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(featured_image__isnull=False)

        return queryset

class BlogCategoryListView(generics.ListAPIView):
    """
    List blog categories that have published posts.
    """
    queryset = BlogCategory.objects.annotate(
        post_count=Count('posts', filter=Q(posts__status__iexact='published'))
    ).filter(post_count__gt=0)
    serializer_class = BlogCategorySerializer
    pagination_class = None

class BlogTagListView(generics.ListAPIView):
    """
    List blog tags that have published posts.
    """
    queryset = BlogTag.objects.annotate(
        post_count=Count('posts', filter=Q(posts__status__iexact='published'))
    ).filter(post_count__gt=0)
    serializer_class = BlogTagSerializer
    pagination_class = None

class FeaturedPostsView(generics.ListAPIView):
    """
    List 5 most recent featured posts with a cover image.
    """
    queryset = BlogPost.objects.filter(
        status__iexact='published',
        cover_image__isnull=False
    ).order_by('-published_date')[:5]
    serializer_class = BlogPostListSerializer
    pagination_class = None

class BlogSearchView(generics.GenericAPIView):
    """
    Search posts by keyword, category, tag, and date.
    """
    serializer_class = BlogSearchSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        query = serializer.validated_data.get('query')
        category = serializer.validated_data.get('category')
        tag = serializer.validated_data.get('tag')
        year = serializer.validated_data.get('year')
        month = serializer.validated_data.get('month')

        queryset = BlogPost.objects.filter(status__iexact='published')

        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(content__icontains=query) |
                Q(excerpt__icontains=query) |
                Q(tags__name__icontains=query)
            ).distinct()

        if category:
            queryset = queryset.filter(category__slug=category)
        if tag:
            queryset = queryset.filter(tags__slug=tag)
        if year:
            queryset = queryset.filter(published_date__year=year)
            if month:
                queryset = queryset.filter(published_date__month=month)

        queryset = queryset.order_by('-published_date')
        return Response(BlogPostListSerializer(queryset, many=True).data)

class BlogArchiveView(generics.GenericAPIView):
    """
    Retrieve monthly archive data with post counts.
    """
    def get(self, request):
        dates = BlogPost.objects.filter(status__iexact='published').dates('published_date', 'month', order='DESC')
        archive = [
            {
                'year': date.year,
                'month': date.month,
                'month_name': date.strftime('%B'),
                'post_count': BlogPost.objects.filter(
                    status__iexact='published',
                    published_date__year=date.year,
                    published_date__month=date.month
                ).count()
            }
            for date in dates
        ]
        return Response(archive)

class CategoryPostsView(generics.ListAPIView):
    """
    List all posts under a specific category slug.
    """
    serializer_class = BlogPostListSerializer

    def get_queryset(self):
        category = get_object_or_404(BlogCategory, slug=self.kwargs['slug'])
        return BlogPost.objects.filter(
            status__iexact='published',
            category=category
        ).order_by('-published_date')

class TagPostsView(generics.ListAPIView):
    """
    List all posts under a specific tag slug.
    """
    serializer_class = BlogPostListSerializer

    def get_queryset(self):
        tag = get_object_or_404(BlogTag, slug=self.kwargs['slug'])
        return BlogPost.objects.filter(
            status__iexact='published',
            tags=tag
        ).order_by('-published_date')
