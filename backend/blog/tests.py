# backend/blog/tests.py
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import BlogCategory, BlogTag, BlogPost
from accounts.models import User
from datetime import datetime, timedelta

class BlogTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create test user
        self.user = User.objects.create_user(
            email='author@example.com',
            password='testpass123',
            first_name='Test',
            last_name='Author'
        )
        
        # Create test category
        self.category = BlogCategory.objects.create(
            name='Interior Design',
            slug='interior-design'
        )
        
        # Create test tag
        self.tag = BlogTag.objects.create(
            name='Modern',
            slug='modern'
        )
        
        # Create test post
        self.post = BlogPost.objects.create(
            title='Modern Interior Design Trends',
            slug='modern-interior-design-trends',
            author=self.user,
            category=self.category,
            excerpt='Latest trends in modern interior design',
            content='Detailed content about modern design trends',
            status='PUBLISHED',
            published_date=datetime.now()
        )
        self.post.tags.add(self.tag)
    
    def test_blog_post_list(self):
        url = reverse('blogpost-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_blog_post_detail(self):
        url = reverse('blogpost-detail', kwargs={'pk': self.post.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Modern Interior Design Trends')
    
    def test_category_list(self):
        url = reverse('blog-category-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_tag_list(self):
        url = reverse('blog-tag-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_featured_posts(self):
        url = reverse('featured-posts')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_blog_search(self):
        url = reverse('blog-search')
        data = {'query': 'modern'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_blog_archive(self):
        url = reverse('blog-archive')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_category_posts(self):
        url = reverse('category-posts', kwargs={'slug': self.category.slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_tag_posts(self):
        url = reverse('tag-posts', kwargs={'slug': self.tag.slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)