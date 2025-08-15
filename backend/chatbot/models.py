#backend/chatbot/models.py
from django.db import models
from accounts.models import User
from django.utils.translation import gettext_lazy as _

class ChatbotConversation(models.Model):
    session_id = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    context = models.JSONField(default=dict)  # Store conversation context
    
    class Meta:
        ordering = ['-started_at']
    
    def __str__(self):
        return f"Conversation {self.session_id}"

class ChatbotMessage(models.Model):
    MESSAGE_TYPES = [
        ('USER', 'User Message'),
        ('BOT', 'Bot Response'),
        ('SYSTEM', 'System Message'),
    ]
    
    conversation = models.ForeignKey(ChatbotConversation, on_delete=models.CASCADE, related_name='messages')
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    intent = models.CharField(max_length=100, blank=True)
    parameters = models.JSONField(default=dict)  # Store extracted parameters
    
    class Meta:
        ordering = ['timestamp']
    
    def __str__(self):
        return f"{self.get_message_type_display()} at {self.timestamp}"

class ChatbotLead(models.Model):
    conversation = models.ForeignKey(ChatbotConversation, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    city = models.CharField(max_length=50)
    requirements = models.TextField(blank=True)
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    room_type = models.CharField(max_length=50, blank=True)
    converted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Lead: {self.name} ({self.email})"

class ChatbotFAQ(models.Model):
    CATEGORY_CHOICES = [
        ('GENERAL', 'General Questions'),
        ('SERVICES', 'Our Services'),
        ('PRICING', 'Pricing & Packages'),
        ('PROCESS', 'Our Process'),
        ('MATERIALS', 'Materials & Quality'),
        ('TIMELINE', 'Project Timeline'),
        ('WARRANTY', 'Warranty & Support'),
    ]
    
    question = models.CharField(max_length=200)
    answer = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='GENERAL')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['category', 'question']
        verbose_name = 'Chatbot FAQ'
        verbose_name_plural = 'Chatbot FAQs'
    
    def __str__(self):
        return self.question