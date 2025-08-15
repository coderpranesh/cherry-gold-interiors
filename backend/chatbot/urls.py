#backend/chatbot/urls.py
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ChatbotView,
    ChatbotConversationViewSet,
    ChatbotMessageViewSet,
    ChatbotLeadViewSet,
    ChatbotFAQViewSet,
    ChatbotHandoffView,
    ChatbotLeadCaptureView,
)

router = DefaultRouter()
router.register(r'conversations', ChatbotConversationViewSet, basename='chatbotconversation')
router.register(r'messages', ChatbotMessageViewSet, basename='chatbotmessage')
router.register(r'leads', ChatbotLeadViewSet, basename='chatbotlead')
router.register(r'faqs', ChatbotFAQViewSet, basename='chatbotfaq')

urlpatterns = [
    path('interact/', ChatbotView.as_view(), name='chatbot-interact'),
    path('handoff/', ChatbotHandoffView.as_view(), name='chatbot-handoff'),
    path('capture-lead/', ChatbotLeadCaptureView.as_view(), name='chatbot-capture-lead'),
] + router.urls