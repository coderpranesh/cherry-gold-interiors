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
    queryset = BlogPost.objects.filter(status='PUBLISHED')

    def get_serializer_class(self):
        return BlogPostListSerializer if self.action == 'list' else BlogPostDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
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
    queryset = BlogCategory.objects.annotate(
        post_count=Count('posts', filter=Q(posts__status='PUBLISHED'))
    ).filter(post_count__gt=0)
    serializer_class = BlogCategorySerializer
    pagination_class = None

class BlogTagListView(generics.ListAPIView):
    queryset = BlogTag.objects.annotate(
        post_count=Count('posts', filter=Q(posts__status='PUBLISHED'))
    ).filter(post_count__gt=0)
    serializer_class = BlogTagSerializer
    pagination_class = None

class FeaturedPostsView(generics.ListAPIView):
    queryset = BlogPost.objects.filter(status='PUBLISHED', featured_image__isnull=False).order_by('-published_date')[:5]
    serializer_class = BlogPostListSerializer
    pagination_class = None

class BlogSearchView(generics.GenericAPIView):
    serializer_class = BlogSearchSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        query = serializer.validated_data.get('query')
        category = serializer.validated_data.get('category')
        tag = serializer.validated_data.get('tag')
        year = serializer.validated_data.get('year')
        month = serializer.validated_data.get('month')

        queryset = BlogPost.objects.filter(status='PUBLISHED')

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

        return Response(BlogPostListSerializer(queryset, many=True).data)

class BlogArchiveView(generics.GenericAPIView):
    def get(self, request):
        dates = BlogPost.objects.filter(status='PUBLISHED').dates('published_date', 'month', order='DESC')
        archive = [
            {
                'year': date.year,
                'month': date.month,
                'month_name': date.strftime('%B'),
                'post_count': BlogPost.objects.filter(
                    status='PUBLISHED',
                    published_date__year=date.year,
                    published_date__month=date.month
                ).count()
            }
            for date in dates
        ]
        return Response(archive)

class CategoryPostsView(generics.ListAPIView):
    serializer_class = BlogPostListSerializer

    def get_queryset(self):
        category = get_object_or_404(BlogCategory, slug=self.kwargs['slug'])
        return BlogPost.objects.filter(status='PUBLISHED', category=category)

class TagPostsView(generics.ListAPIView):
    serializer_class = BlogPostListSerializer

    def get_queryset(self):
        tag = get_object_or_404(BlogTag, slug=self.kwargs['slug'])
        return BlogPost.objects.filter(status='PUBLISHED', tags=tag)
