#backend/chatbot/serializers.py
from rest_framework import serializers
from .models import (
    ChatbotConversation,
    ChatbotMessage,
    ChatbotLead,
    ChatbotFAQ,
)
from accounts.serializers import UserSerializer

class ChatbotConversationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ChatbotConversation
        fields = ['id', 'session_id', 'user', 'started_at', 'ended_at', 'context']

class ChatbotMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatbotMessage
        fields = [
            'id', 'conversation', 'message_type', 'content',
            'timestamp', 'intent', 'parameters'
        ]

class ChatbotLeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatbotLead
        fields = [
            'id', 'conversation', 'name', 'email', 'phone',
            'city', 'requirements', 'budget', 'room_type',
            'converted', 'created_at', 'updated_at'
        ]
        read_only_fields = ['converted', 'created_at', 'updated_at']

class ChatbotFAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatbotFAQ
        fields = [
            'id', 'question', 'answer', 'category',
            'is_active', 'created_at', 'updated_at'
        ]

class ChatbotRequestSerializer(serializers.Serializer):
    session_id = serializers.CharField(max_length=100, required=False)
    message = serializers.CharField()
    context = serializers.JSONField(required=False)

class ChatbotResponseSerializer(serializers.Serializer):
    session_id = serializers.CharField()
    response = serializers.CharField()
    context = serializers.JSONField()
    intent = serializers.CharField(required=False)
    parameters = serializers.JSONField(required=False)
    suggestions = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )

class LeadCaptureSerializer(serializers.Serializer):
    session_id = serializers.CharField()
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=15)
    city = serializers.CharField(max_length=50)
    requirements = serializers.CharField(required=False, allow_blank=True)
    budget = serializers.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        required=False, 
        allow_null=True
    )
    room_type = serializers.CharField(required=False, allow_blank=True)