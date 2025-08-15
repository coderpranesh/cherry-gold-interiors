# backend/services/views.py
from rest_framework import generics, status, filters
from rest_framework.response import Response
from .models import ServiceRequest, ServiceSequence
from .serializers import ServiceRequestSerializer, ServiceSequenceSerializer
from django.core.mail import send_mail
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.db import transaction
from django.core.exceptions import ValidationError
import logging

logger = logging.getLogger(__name__)

class ServiceRequestListCreateView(generics.ListCreateAPIView):
    queryset = ServiceRequest.objects.all().order_by('-created_at')
    serializer_class = ServiceRequestSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['service_type', 'status', 'service_number']
    search_fields = ['service_number', 'full_name', 'phone_number', 'email']
    
    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                
                instance = serializer.save()
                
                # Send emails in transaction.on_commit to ensure they only send after successful save
                transaction.on_commit(lambda: self.send_notification_emails(instance))
                
                headers = self.get_success_headers(serializer.data)
                return Response(
                    {
                        'status': 'success',
                        'service_number': instance.service_number,
                        'data': serializer.data
                    },
                    status=status.HTTP_201_CREATED,
                    headers=headers
                )
                
        except ValidationError as e:
            logger.error(f"Validation error creating service request: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        except Exception as e:
            logger.error(f"Error creating service request: {str(e)}", exc_info=True)
            return Response(
                {'error': 'An unexpected error occurred. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def send_notification_emails(self, service_request):
        """Send both admin notification and customer confirmation emails"""
        try:
            self.send_admin_notification(service_request)
            self.send_customer_confirmation(service_request)
        except Exception as e:
            logger.error(f"Error sending notification emails: {str(e)}", exc_info=True)
    
    def send_admin_notification(self, service_request):
        """Send detailed notification to admin team"""
        context = {
            'service_request': service_request,
            'admin_email': settings.ADMIN_EMAIL,
            'site_name': settings.SITE_NAME,
            'service_type_display': service_request.get_service_type_display(),
            'created_at': service_request.created_at.strftime('%Y-%m-%d %H:%M'),
            'status': service_request.get_status_display()
        }
        
        subject = f"New Service Request: {service_request.service_number}"
        html_message = render_to_string('emails/admin_notification.html', context)
        plain_message = strip_tags(html_message)
        
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                html_message=html_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.ADMIN_EMAIL],
                fail_silently=False,
            )
        except Exception as e:
            logger.error(f"Failed to send admin notification: {str(e)}")
            raise
    
    def send_customer_confirmation(self, service_request):
        """Send confirmation email to customer if email provided"""
        if not service_request.email:
            return
            
        context = {
            'service_request': service_request,
            'contact_email': settings.CONTACT_EMAIL,
            'contact_phone': settings.CONTACT_PHONE,
            'site_name': settings.SITE_NAME,
            'service_number': service_request.service_number,
            'service_type_display': service_request.get_service_type_display(),
            'status': service_request.get_status_display()
        }
        
        subject = f"Confirmation for your {service_request.get_service_type_display()} request"
        html_message = render_to_string('emails/customer_confirmation.html', context)
        plain_message = strip_tags(html_message)
        
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                html_message=html_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[service_request.email],
                fail_silently=True,
            )
        except Exception as e:
            logger.error(f"Failed to send customer confirmation: {str(e)}")

class ServiceRequestRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = ServiceRequest.objects.all()
    serializer_class = ServiceRequestSerializer
    lookup_field = 'service_number'
    
    def update(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                partial = kwargs.pop('partial', False)
                instance = self.get_object()
                serializer = self.get_serializer(instance, data=request.data, partial=partial)
                serializer.is_valid(raise_exception=True)
                
                # Check if status changed
                status_changed = (
                    'status' in request.data and 
                    instance.status != request.data['status']
                )
                
                instance = serializer.save()
                
                if status_changed:
                    transaction.on_commit(lambda: self.send_status_update(instance))
                
                return Response(serializer.data)
                
        except ValidationError as e:
            logger.error(f"Validation error updating service request: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        except Exception as e:
            logger.error(f"Error updating service request: {str(e)}", exc_info=True)
            return Response(
                {'error': 'An unexpected error occurred. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def send_status_update(self, service_request):
        """Send status update email to customer"""
        if not service_request.email:
            return
            
        context = {
            'service_request': service_request,
            'contact_email': settings.CONTACT_EMAIL,
            'site_name': settings.SITE_NAME,
            'service_number': service_request.service_number,
            'old_status': self.get_object().get_status_display(),
            'new_status': service_request.get_status_display(),
            'status_changed': service_request.status_changed.strftime('%Y-%m-%d %H:%M')
        }
        
        subject = f"Update on Your Service Request {service_request.service_number}"
        html_message = render_to_string('emails/status_update.html', context)
        plain_message = strip_tags(html_message)
        
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                html_message=html_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[service_request.email],
                fail_silently=True,
            )
        except Exception as e:
            logger.error(f"Failed to send status update: {str(e)}")

class ServiceTypeListView(generics.ListAPIView):
    """Base class for service type specific views"""
    serializer_class = ServiceRequestSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'preferred_date']
    search_fields = ['service_number', 'full_name', 'phone_number']
    
    def get_queryset(self):
        try:
            return ServiceRequest.objects.filter(
                service_type=self.service_type
            ).order_by('-created_at').select_related()
        except Exception as e:
            logger.error(f"Error retrieving service requests: {str(e)}")
            return ServiceRequest.objects.none()

class RepairRequestListView(ServiceTypeListView):
    service_type = 'repair'

class ConsultationListView(ServiceTypeListView):
    service_type = 'video'

class OnsiteServiceListView(ServiceTypeListView):
    service_type = 'onsite'

class ServiceSequenceView(generics.RetrieveAPIView):
    """View to get current sequence information"""
    queryset = ServiceSequence.objects.all()
    serializer_class = ServiceSequenceSerializer
    lookup_field = 'year_month'
    
    def get_object(self):
        year_month = self.kwargs.get('year_month')
        obj, created = ServiceSequence.objects.get_or_create(year_month=year_month)
        return obj