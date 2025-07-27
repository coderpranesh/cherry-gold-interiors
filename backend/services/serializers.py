from rest_framework import serializers
from .models import (
    ServiceRequest,
    ConsultationBooking,
    RepairRequest,
    OnSiteService,
)
from accounts.serializers import UserSerializer
from django.utils import timezone

class ServiceRequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ServiceRequest
        fields = [
            'id', 'user', 'service_type', 'description', 
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['status', 'created_at', 'updated_at']

class ConsultationBookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    is_upcoming = serializers.SerializerMethodField()
    
    class Meta:
        model = ConsultationBooking
        fields = [
            'id', 'user', 'consultation_type', 'scheduled_at', 
            'duration', 'notes', 'status', 'is_upcoming', 'created_at'
        ]
        read_only_fields = ['status', 'created_at']
    
    def get_is_upcoming(self, obj):
        return obj.scheduled_at > timezone.now()
    
    def validate_scheduled_at(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("Scheduled time must be in the future")
        return value

class RepairRequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = RepairRequest
        fields = [
            'id', 'user', 'item_name', 'item_description', 
            'purchase_date', 'warranty_available', 'issue_description',
            'urgency', 'status', 'created_at'
        ]
        read_only_fields = ['status', 'created_at']

class OnSiteServiceSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    is_upcoming = serializers.SerializerMethodField()
    
    class Meta:
        model = OnSiteService
        fields = [
            'id', 'user', 'service_type', 'preferred_date', 
            'preferred_time', 'address', 'contact_person',
            'contact_number', 'special_instructions', 'status',
            'is_upcoming', 'created_at'
        ]
        read_only_fields = ['status', 'created_at']
    
    def get_is_upcoming(self, obj):
        from django.utils import timezone
        from datetime import datetime
        service_datetime = datetime.combine(obj.preferred_date, obj.preferred_time)
        return service_datetime > timezone.now()
    
    def validate(self, data):
        if data['preferred_date'] < timezone.now().date():
            raise serializers.ValidationError({
                'preferred_date': 'Preferred date must be in the future'
            })
        return data

class ServiceCalendarSerializer(serializers.Serializer):
    date = serializers.DateField()
    consultations = ConsultationBookingSerializer(many=True)
    onsite_services = OnSiteServiceSerializer(many=True)