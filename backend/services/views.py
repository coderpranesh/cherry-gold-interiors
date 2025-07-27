from rest_framework import viewsets, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from .models import (
    ServiceRequest,
    ConsultationBooking,
    RepairRequest,
    OnSiteService,
)
from .serializers import (
    ServiceRequestSerializer,
    ConsultationBookingSerializer,
    RepairRequestSerializer,
    OnSiteServiceSerializer,
    ServiceCalendarSerializer,
)
from accounts.models import User

class ServiceRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ServiceRequest.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ConsultationBookingViewSet(viewsets.ModelViewSet):
    serializer_class = ConsultationBookingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ConsultationBooking.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RepairRequestViewSet(viewsets.ModelViewSet):
    serializer_class = RepairRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return RepairRequest.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class OnSiteServiceViewSet(viewsets.ModelViewSet):
    serializer_class = OnSiteServiceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return OnSiteService.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ServiceCalendarView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        date_str = request.query_params.get('date')
        if date_str:
            try:
                date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, 
                              status=400)
        else:
            date = timezone.now().date()
        
        consultations = ConsultationBooking.objects.filter(
            user=request.user,
            scheduled_at__date=date
        )
        
        onsite_services = OnSiteService.objects.filter(
            user=request.user,
            preferred_date=date
        )
        
        serializer = ServiceCalendarSerializer({
            'date': date,
            'consultations': consultations,
            'onsite_services': onsite_services
        })
        
        return Response(serializer.data)

class AvailableTimeSlotsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        date_str = request.query_params.get('date')
        duration = int(request.query_params.get('duration', 30))
        
        if not date_str:
            return Response({'error': 'Date parameter is required'}, status=400)
        
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, 
                          status=400)
        
        # Business hours (10 AM to 6 PM)
        start_time = datetime.combine(date, datetime.strptime('10:00', '%H:%M').time())
        end_time = datetime.combine(date, datetime.strptime('18:00', '%H:%M').time())
        
        # Get booked slots for the day
        booked_slots = ConsultationBooking.objects.filter(
            scheduled_at__date=date
        ).values_list('scheduled_at', 'duration')
        
        # Generate all possible slots
        slot_duration = timedelta(minutes=duration)
        current_slot = start_time
        available_slots = []
        
        while current_slot + slot_duration <= end_time:
            slot_end = current_slot + slot_duration
            slot_available = True
            
            for booked_start, booked_duration in booked_slots:
                booked_end = booked_start + timedelta(minutes=booked_duration)
                
                # Check if slots overlap
                if not (slot_end <= booked_start or current_slot >= booked_end):
                    slot_available = False
                    break
            
            if slot_available:
                available_slots.append(current_slot.time())
            
            current_slot += timedelta(minutes=15)  # Next slot starts every 15 minutes
        
        return Response({
            'date': date,
            'duration': duration,
            'available_slots': [slot.strftime('%H:%M') for slot in available_slots]
        })