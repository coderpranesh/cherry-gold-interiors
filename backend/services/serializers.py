# backend/services/serializers.py
from rest_framework import serializers
from .models import ServiceRequest, ServiceSequence
from django.core.validators import RegexValidator
import re
from django.utils import timezone

class ServiceRequestSerializer(serializers.ModelSerializer):
    service_type_display = serializers.CharField(source='get_service_type_display', read_only=True)
    preferred_time_display = serializers.CharField(source='get_preferred_time_display', read_only=True)
    project_type_display = serializers.CharField(source='get_project_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = ServiceRequest
        fields = [
            'id',
            'service_type',
            'service_type_display',
            'service_number',
            'full_name',
            'phone_number',
            'email',
            'issue_description',
            'preferred_date',
            'preferred_time',
            'preferred_time_display',
            'complete_address',
            'project_type',
            'project_type_display',
            'project_details',
            'created_at',
            'updated_at',
            'status',
            'status_display',
            'status_changed',
            'notes'
        ]
        read_only_fields = (
            'id',
            'service_number',
            'created_at',
            'updated_at',
            'service_type_display',
            'preferred_time_display',
            'project_type_display',
            'status_display',
            'status_changed'
        )
        extra_kwargs = {
            'email': {'required': False, 'allow_blank': True},
            'issue_description': {'required': False, 'allow_blank': True},
            'project_details': {'required': False, 'allow_blank': True},
            'notes': {'required': False, 'allow_blank': True}
        }

    def validate_phone_number(self, value):
        """Validate phone number format"""
        if not re.match(r'^\+?[0-9]{10,15}$', value):
            raise serializers.ValidationError(
                "Phone number must be 10-15 digits and may include country code"
            )
        return value

    def validate_email(self, value):
        """Validate email format if provided"""
        if value and not re.match(r'^[^@]+@[^@]+\.[^@]+$', value):
            raise serializers.ValidationError("Enter a valid email address")
        return value

    def validate_preferred_date(self, value):
        if value:
            if isinstance(value, str):
                try:
                    # Parse string date if needed
                    from datetime import datetime
                    value = datetime.strptime(value, '%Y-%m-%d').date()
                except ValueError:
                    raise serializers.ValidationError("Use YYYY-MM-DD format")
            
            if value < timezone.now().date():
                raise serializers.ValidationError("Date cannot be in the past")
        return value

    def validate_status(self, value):
        """Validate status transitions"""
        if self.instance and self.instance.status == 'completed' and value != 'completed':
            raise serializers.ValidationError("Cannot change status from completed")
        return value

    def validate(self, data):
        """Service type specific validation"""
        service_type = data.get('service_type', self.instance.service_type if self.instance else None)
        
        # Common required fields for all service types
        required_fields = {
            'full_name': 'Full name is required',
            'phone_number': 'Phone number is required'
        }
        
        # Service type specific requirements
        service_requirements = {
            'repair': {
                'issue_description': 'Issue description is required for repair requests'
            },
            'video': {
                'email': 'Email is required for video consultancy',
                'preferred_date': 'Preferred date is required for video consultancy',
                'preferred_time': 'Preferred time is required for video consultancy'
            },
            'onsite': {
                'complete_address': 'Complete address is required for on-site consultancy',
                'preferred_date': 'Preferred date is required for on-site consultancy',
                'preferred_time': 'Preferred time is required for on-site consultancy',
                'project_type': 'Project type is required for on-site consultancy'
            }
        }

        # Check common required fields
        errors = {}
        for field, message in required_fields.items():
            if not data.get(field):
                errors[field] = message

        # Check service type specific requirements
        if service_type in service_requirements:
            for field, message in service_requirements[service_type].items():
                if not data.get(field):
                    errors[field] = message

        if errors:
            raise serializers.ValidationError(errors)

        return data

    def create(self, validated_data):
        """Ensure service_number is not in the validated data as it's auto-generated"""
        validated_data.pop('service_number', None)
        
        # Set default status if not provided
        if 'status' not in validated_data:
            validated_data['status'] = 'new'
            
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Handle status changes and update timestamps"""
        new_status = validated_data.get('status')
        if new_status and new_status != instance.status:
            validated_data['status_changed'] = timezone.now()
            
        return super().update(instance, validated_data)


class ServiceSequenceSerializer(serializers.ModelSerializer):
    next_number = serializers.SerializerMethodField()
    
    class Meta:
        model = ServiceSequence
        fields = ['year_month', 'last_sequence', 'next_number']
        read_only_fields = ['year_month', 'last_sequence', 'next_number']
    
    def get_next_number(self, obj):
        return f"CG{obj.year_month}{obj.last_sequence + 1:04d}"