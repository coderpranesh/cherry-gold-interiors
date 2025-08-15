#backend/projects/tests.py
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from datetime import date, timedelta
from .models import Project, ProjectStage, ProjectUpdate
from accounts.models import User

class ProjectsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='client@example.com',
            password='testpass123',
            first_name='Test',
            last_name='Client'
        )
        
        self.staff_user = User.objects.create_user(
            email='staff@cherrygold.com',
            password='staffpass123',
            first_name='Staff',
            last_name='User',
            is_staff=True
        )
        
        # Authenticate the client
        self.client.force_authenticate(user=self.user)
        
        # Create test project
        self.project = Project.objects.create(
            client=self.user,
            package='PRE',
            status='DESIGN',
            start_date=date.today(),
            estimated_completion=date.today() + timedelta(days=30),
            area=120,
            budget=216000
        )
        
        # Create test stage
        self.stage = ProjectStage.objects.create(
            project=self.project,
            name='Design Phase',
            start_date=date.today(),
            end_date=date.today() + timedelta(days=7)
        )
        
        # Create test update
        self.update = ProjectUpdate.objects.create(
            project=self.project,
            update_type='PROGRESS',
            title='Initial Design Completed',
            description='First draft of design completed',
            created_by=self.staff_user
        )
    
    def test_project_create(self):
        url = reverse('project-list')
        data = {
            'package': 'PRE',
            'start_date': (date.today() + timedelta(days=1)).isoformat(),
            'estimated_completion': (date.today() + timedelta(days=31)).isoformat(),
            'area': 150,
            'budget': 270000
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['work_code'].startswith('CGI-'))
    
    def test_project_list(self):
        url = reverse('project-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_project_detail(self):
        url = reverse('project-detail', kwargs={'pk': self.project.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['package'], 'PRE')
    
    def test_project_timeline(self):
        url = reverse('project-timeline', kwargs={'project_id': self.project.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['stages']), 1)
        self.assertEqual(len(response.data['updates']), 1)
    
    def test_budget_calculator(self):
        url = reverse('budget-calculator')
        data = {'area': 150, 'package': 'PRE'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['budget'], 270000)
    
    def test_project_by_workcode(self):
        url = reverse('project-by-workcode', kwargs={'work_code': self.project.work_code})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['work_code'], self.project.work_code)