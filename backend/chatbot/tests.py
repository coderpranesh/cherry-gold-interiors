from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import ChatbotConversation, ChatbotMessage, ChatbotLead
from accounts.models import User

class ChatbotTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        # Create test conversation
        self.conversation = ChatbotConversation.objects.create(
            session_id='test-session-123',
            user=self.user
        )
        
        # Create test message
        self.message = ChatbotMessage.objects.create(
            conversation=self.conversation,
            message_type='USER',
            content='Hello chatbot'
        )
    
    def test_chatbot_interact(self):
        url = reverse('chatbot-interact')
        data = {
            'session_id': 'test-session-123',
            'message': 'What services do you offer?'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('response', response.data)
    
    def test_new_chatbot_session(self):
        url = reverse('chatbot-interact')
        data = {
            'message': 'Hello, I need help'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('session_id', response.data)
    
    def test_lead_capture(self):
        url = reverse('chatbot-capture-lead')
        data = {
            'session_id': 'test-session-123',
            'name': 'Test Lead',
            'email': 'lead@example.com',
            'phone': '9876543210',
            'city': 'Bangalore'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['success'], 'Lead captured successfully')
    
    def test_conversation_list(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('chatbotconversation-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_message_list(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('chatbotmessage-list', kwargs={'conversation_id': self.conversation.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)