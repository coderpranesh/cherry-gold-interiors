from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.utils import timezone
from datetime import datetime, timedelta
from .models import ConsultationBooking, RepairRequest, OnSiteService
from accounts.models import User

class ServicesTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='client@example.com',
            password='testpass123',
            first_name='Test',
            last_name='Client'
        )
        
        # Authenticate the user
        self.client.force_authenticate(user=self.user)
        
        # Create test data
        future_date = timezone.now() + timedelta(days=2)
        self.consultation = ConsultationBooking.objects.create(
            user=self.user,
            consultation_type='VIDEO',
            scheduled_at=future_date,
            duration=30
        )
        
        self.repair = RepairRequest.objects.create(
            user=self.user,
            item_name='Kitchen Cabinet',
            item_description='Premium kitchen cabinet',
            issue_description='Door hinge broken',
            urgency='MEDIUM'
        )
        
        self.onsite = OnSiteService.objects.create(
            user=self.user,
            service_type='MEASUREMENT',
            preferred_date=(timezone.now() + timedelta(days=3)).date(),
            preferred_time=datetime.strptime('14:00', '%H:%M').time(),
            address='123 Test Street, Bangalore',
            contact_person='Test Client',
            contact_number='9876543210'
        )
    
    def test_service_request_create(self):
        url = reverse('servicerequest-list')
        data = {
            'service_type': 'CONSULT',
            'description': 'Need design consultation'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['service_type'], 'CONSULT')
    
    def test_consultation_booking(self):
        url = reverse('consultation-list')
        future_time = timezone.now() + timedelta(days=1, hours=2)
        data = {
            'consultation_type': 'VIDEO',
            'scheduled_at': future_time.isoformat(),
            'duration': 45,
            'notes': 'Need help with kitchen design'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_repair_request(self):
        url = reverse('repairrequest-list')
        data = {
            'item_name': 'Wardrobe Door',
            'item_description': 'Sliding door wardrobe',
            'issue_description': 'Door track damaged',
            'urgency': 'HIGH'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['urgency'], 'HIGH')
    
    def test_onsite_service(self):
        url = reverse('onsiteservice-list')
        data = {
            'service_type': 'INSTALLATION',
            'preferred_date': (timezone.now() + timedelta(days=4)).date().isoformat(),
            'preferred_time': '15:00',
            'address': '456 Test Avenue, Bangalore',
            'contact_person': 'Test Client',
            'contact_number': '9876543210'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['service_type'], 'INSTALLATION')
    
    def test_service_calendar(self):
        url = reverse('service-calendar')
        test_date = (timezone.now() + timedelta(days=2)).date().isoformat()
        response = self.client.get(url, {'date': test_date})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data['consultations']) >= 1)
    
    def test_available_time_slots(self):
        url = reverse('available-timeslots')
        test_date = (timezone.now() + timedelta(days=5)).date().isoformat()
        response = self.client.get(url, {'date': test_date, 'duration': 30})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data['available_slots']) > 0)