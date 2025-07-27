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

router = DefaultRouter()
router.register(r'posts', BlogPostViewSet, basename='blogpost')

urlpatterns = [
    path('categories/', BlogCategoryListView.as_view(), name='blog-category-list'),
    path('tags/', BlogTagListView.as_view(), name='blog-tag-list'),
    path('featured/', FeaturedPostsView.as_view(), name='featured-posts'),
    path('search/', BlogSearchView.as_view(), name='blog-search'),
    path('archive/', BlogArchiveView.as_view(), name='blog-archive'),
    path('categories/<slug:slug>/', CategoryPostsView.as_view(), name='category-posts'),
    path('tags/<slug:slug>/', TagPostsView.as_view(), name='tag-posts'),
] + router.urls