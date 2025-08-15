#backend/chatbot/admin.py
from django.contrib import admin
from .models import (
    ChatbotConversation,
    ChatbotMessage,
    ChatbotLead,
    ChatbotFAQ
)

@admin.register(ChatbotConversation)
class ChatbotConversationAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'user', 'started_at', 'ended_at')
    search_fields = ('session_id', 'user__email')

@admin.register(ChatbotMessage)
class ChatbotMessageAdmin(admin.ModelAdmin):
    list_display = ('conversation', 'message_type', 'timestamp')
    list_filter = ('message_type',)
    search_fields = ('content', 'conversation__session_id')

@admin.register(ChatbotLead)
class ChatbotLeadAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'city', 'converted', 'created_at')
    list_filter = ('converted', 'city')
    search_fields = ('name', 'email', 'phone')

@admin.register(ChatbotFAQ)
class ChatbotFAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'category', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('question', 'answer')