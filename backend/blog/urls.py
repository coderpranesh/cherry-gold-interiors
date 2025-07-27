from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    BlogPostViewSet,
    BlogCategoryListView,
    BlogTagListView,
    FeaturedPostsView,
    BlogSearchView,
    BlogArchiveView,
    CategoryPostsView,
    TagPostsView,
)

# Router for read-only blog posts (list, retrieve)
router = DefaultRouter()
router.register(r'posts', BlogPostViewSet, basename='blogpost')

urlpatterns = [
    # List all categories with published posts
    path('categories/', BlogCategoryListView.as_view(), name='blog-category-list'),

    # List all tags with published posts
    path('tags/', BlogTagListView.as_view(), name='blog-tag-list'),

    # List featured posts (latest 5 with featured image)
    path('featured/', FeaturedPostsView.as_view(), name='featured-posts'),

    # Search posts by query, category, tag, year, month
    path('search/', BlogSearchView.as_view(), name='blog-search'),

    # Archive of posts grouped by month/year
    path('archive/', BlogArchiveView.as_view(), name='blog-archive'),

    # List posts in a specific category by slug
    path('categories/<slug:slug>/', CategoryPostsView.as_view(), name='category-posts'),

    # List posts with a specific tag by slug
    path('tags/<slug:slug>/', TagPostsView.as_view(), name='tag-posts'),
]

# Add router-generated routes (posts/)
urlpatterns += router.urls
