#backend/portfolio/tests.py
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import PortfolioItem, PortfolioImage, CaseStudy
from accounts.models import User

class PortfolioTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='admin@cherrygold.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        
        # Create test portfolio item
        self.portfolio_item = PortfolioItem.objects.create(
            title='Modern Kitchen Design',
            category='KIT',
            description='A beautiful modern kitchen design',
            main_image='portfolio/main_images/test.jpg',
            is_featured=True
        )
        
        # Create test image
        self.portfolio_image = PortfolioImage.objects.create(
            portfolio_item=self.portfolio_item,
            image='portfolio/images/test1.jpg',
            caption='Test Image'
        )
        
        # Create test case study
        self.case_study = CaseStudy.objects.create(
            portfolio_item=self.portfolio_item,
            title='Kitchen Transformation',
            content='Detailed case study content'
        )
    
    def test_portfolio_list(self):
        url = reverse('portfolioitem-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_portfolio_detail(self):
        url = reverse('portfolioitem-detail', kwargs={'slug': self.portfolio_item.slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Modern Kitchen Design')
    
    def test_category_list(self):
        url = reverse('category-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)
    
    def test_featured_portfolio(self):
        url = reverse('featured-portfolio')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_case_study_detail(self):
        url = reverse('case-study-detail', kwargs={'pk': self.case_study.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Kitchen Transformation')