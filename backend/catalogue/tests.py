#backend/catalogue/tests.py
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import CatalogueCategory, CatalogueItem, RoomType
from accounts.models import User

class CatalogueTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create test data
        self.category = CatalogueCategory.objects.create(
            name='Modular Kitchen',
            slug='modular-kitchen'
        )
        
        self.room_type = RoomType.objects.create(
            name='Kitchen',
            slug='kitchen'
        )
        
        self.catalogue_item = CatalogueItem.objects.create(
            name='Premium Kitchen Cabinet',
            slug='premium-kitchen-cabinet',
            category=self.category,
            base_price=50000.00,
            description='High quality kitchen cabinet',
            main_image='catalogue/items/test.jpg',
            is_featured=True
        )
        self.catalogue_item.room_types.add(self.room_type)
    
    def test_catalogue_list(self):
        url = reverse('catalogueitem-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_catalogue_detail(self):
        url = reverse('catalogueitem-detail', kwargs={'slug': self.catalogue_item.slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Premium Kitchen Cabinet')
    
    def test_category_list(self):
        url = reverse('category-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_room_type_list(self):
        url = reverse('room-type-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_featured_items(self):
        url = reverse('featured-items')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_search(self):
        url = reverse('catalogue-search')
        data = {'query': 'premium'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)