import dialogflow
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from google.api_core.exceptions import InvalidArgument
from .models import (
    ChatbotConversation,
    ChatbotMessage,
    ChatbotLead,
    ChatbotFAQ,
)
from .serializers import (
    ChatbotRequestSerializer,
    ChatbotResponseSerializer,
    LeadCaptureSerializer,
    ChatbotConversationSerializer,
    ChatbotMessageSerializer,
    ChatbotLeadSerializer,
    ChatbotFAQSerializer,
)
from accounts.models import User
import uuid
import json
from django.shortcuts import get_object_or_404

class ChatbotView(APIView):
    def post(self, request):
        input_serializer = ChatbotRequestSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        
        session_id = input_serializer.validated_data.get('session_id')
        message = input_serializer.validated_data['message']
        context = input_serializer.validated_data.get('context', {})
        
        # Get or create conversation
        if session_id:
            conversation = ChatbotConversation.objects.filter(session_id=session_id).first()
            if not conversation:
                return Response({'error': 'Invalid session ID'}, status=400)
        else:
            # Create new conversation
            session_id = str(uuid.uuid4())
            user = request.user if request.user.is_authenticated else None
            conversation = ChatbotConversation.objects.create(
                session_id=session_id,
                user=user,
                context=context
            )
        
        # Save user message
        user_message = ChatbotMessage.objects.create(
            conversation=conversation,
            message_type='USER',
            content=message
        )
        
        try:
            # Initialize Dialogflow session
            session_client = dialogflow.SessionsClient()
            session = session_client.session_path(settings.DIALOGFLOW_PROJECT_ID, session_id)
            
            # Set context if provided
            if context:
                for context_name, context_params in context.items():
                    context_obj = dialogflow.types.context_pb2.Context(
                        name=session + '/contexts/' + context_name,
                        lifespan_count=5,
                        parameters=context_params
                    )
                    session_client.update_context(session, context_obj)
            
            # Process message with Dialogflow
            text_input = dialogflow.types.TextInput(
                text=message, 
                language_code=settings.DIALOGFLOW_LANGUAGE_CODE
            )
            query_input = dialogflow.types.QueryInput(text=text_input)
            
            response = session_client.detect_intent(
                session=session, 
                query_input=query_input
            )
            
            # Save bot response
            bot_message = ChatbotMessage.objects.create(
                conversation=conversation,
                message_type='BOT',
                content=response.query_result.fulfillment_text,
                intent=response.query_result.intent.display_name,
                parameters=json.loads(
                    response.query_result.parameters.SerializeToString().decode('utf-8')
                )
            )
            
            # Prepare output
            output_serializer = ChatbotResponseSerializer({
                'session_id': session_id,
                'response': response.query_result.fulfillment_text,
                'context': {
                    c.name.split('/')[-1]: json.loads(c.parameters.SerializeToString().decode('utf-8'))
                    for c in response.query_result.output_contexts
                },
                'intent': response.query_result.intent.display_name,
                'parameters': json.loads(
                    response.query_result.parameters.SerializeToString().decode('utf-8')
                ),
                'suggestions': [
                    q for q in response.query_result.fulfillment_messages 
                    if q.platform == 'PLATFORM_UNSPECIFIED'
                ]
            })
            
            return Response(output_serializer.data)
        
        except InvalidArgument as e:
            return Response({'error': str(e)}, status=500)

class ChatbotHandoffView(APIView):
    def post(self, request):
        session_id = request.data.get('session_id')
        if not session_id:
            return Response({'error': 'session_id is required'}, status=400)
        
        conversation = ChatbotConversation.objects.filter(session_id=session_id).first()
        if not conversation:
            return Response({'error': 'Invalid session ID'}, status=404)
        
        # Here you would typically:
        # 1. Create a support ticket
        # 2. Notify the support team
        # 3. Update the conversation context
        
        conversation.context['handoff'] = True
        conversation.save()
        
        return Response({
            'success': 'Handoff to human agent initiated',
            'session_id': session_id
        })

class ChatbotLeadCaptureView(APIView):
    def post(self, request):
        serializer = LeadCaptureSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        session_id = serializer.validated_data['session_id']
        conversation = ChatbotConversation.objects.filter(session_id=session_id).first()
        
        if not conversation:
            return Response({'error': 'Invalid session ID'}, status=404)
        
        # Create or update lead
        lead, created = ChatbotLead.objects.update_or_create(
            conversation=conversation,
            defaults={
                'name': serializer.validated_data['name'],
                'email': serializer.validated_data['email'],
                'phone': serializer.validated_data['phone'],
                'city': serializer.validated_data['city'],
                'requirements': serializer.validated_data.get('requirements', ''),
                'budget': serializer.validated_data.get('budget'),
                'room_type': serializer.validated_data.get('room_type', ''),
            }
        )
        
        # Here you would typically:
        # 1. Send email notification
        # 2. Create CRM entry
        # 3. Trigger follow-up workflow
        
        return Response({
            'success': 'Lead captured successfully',
            'lead_id': lead.id,
            'created': created
        })

class ChatbotConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ChatbotConversationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return ChatbotConversation.objects.all()
        return ChatbotConversation.objects.filter(user=self.request.user)

class ChatbotMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ChatbotMessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        conversation_id = self.kwargs.get('conversation_id')
        if not conversation_id:
            return ChatbotMessage.objects.none()
        
        conversation = get_object_or_404(ChatbotConversation, id=conversation_id)
        
        if not (self.request.user.is_staff or conversation.user == self.request.user):
            self.permission_denied(self.request)
        
        return ChatbotMessage.objects.filter(conversation=conversation)

class ChatbotLeadViewSet(viewsets.ModelViewSet):
    serializer_class = ChatbotLeadSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return ChatbotLead.objects.all()
        return ChatbotLead.objects.filter(conversation__user=self.request.user)

class ChatbotFAQViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ChatbotFAQSerializer
    queryset = ChatbotFAQ.objects.filter(is_active=True)
    pagination_class = None