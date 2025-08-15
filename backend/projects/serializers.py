# backend/projects/serializers.py
from rest_framework import serializers
from .models import (
    Project,
    ProjectStage,
    ProjectUpdate,
    ProjectImage,
    ProjectDocument,
    ProjectTeam,
    BudgetEstimate,
)
from services.models import ServiceRequest
from services.serializers import ServiceRequestSerializer
from accounts.serializers import UserSerializer as UserAccountSerializer
from django.core.validators import MaxValueValidator, MinValueValidator

owner = UserAccountSerializer(read_only=True)

class ProjectImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProjectImage
        fields = ['id', 'url', 'caption', 'uploaded_at']
    
    def get_url(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            return obj.image.url
        return None

class ProjectStageSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    date = serializers.DateField(source='start_date')
    
    class Meta:
        model = ProjectStage
        fields = [
            'id', 'name', 'status', 'status_display', 'date',
            'description', 'start_date', 'end_date', 'completed',
            'completed_date', 'order'
        ]
        read_only_fields = ['status_display']

class ProjectUpdateSerializer(serializers.ModelSerializer):
    created_by = UserAccountSerializer(read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    date = serializers.SerializerMethodField()
    
    class Meta:
        model = ProjectUpdate
        fields = [
            'id', 'update_type', 'title', 'description',
            'created_by', 'created_at', 'date', 'requires_action',
            'action_completed', 'images'
        ]
    
    def get_date(self, obj):
        return obj.created_at.strftime('%Y-%m-%d')

class ProjectDocumentSerializer(serializers.ModelSerializer):
    uploaded_by = UserAccountSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProjectDocument
        fields = [
            'id', 'document_type', 'title', 'file', 'file_url',
            'uploaded_by', 'uploaded_at', 'description'
        ]
        extra_kwargs = {'file': {'write_only': True}}
    
    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None

class ProjectTeamSerializer(serializers.ModelSerializer):
    user = UserAccountSerializer(read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = ProjectTeam
        fields = ['id', 'user', 'role', 'role_display', 'assigned_date', 'is_primary']

class BudgetEstimateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetEstimate
        fields = [
            'id', 'item_name', 'description', 'quantity',
            'unit', 'unit_price', 'total_price'
        ]

class ProjectTrackingSerializer(serializers.ModelSerializer):
    service_number = serializers.SerializerMethodField()
    customer_name = serializers.SerializerMethodField()
    project_type = serializers.CharField(source='get_package_display')
    start_date = serializers.DateField(format='%Y-%m-%d')
    expected_completion = serializers.DateField(source='estimated_completion', format='%Y-%m-%d')
    current_stage = serializers.CharField()
    stages = ProjectStageSerializer(many=True, read_only=True)
    updates = ProjectUpdateSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'service_number', 'customer_name', 'project_type',
            'start_date', 'expected_completion', 'status',
            'current_stage', 'progress', 'stages', 'updates'
        ]
    
    def get_service_number(self, obj):
        """Returns service_request number if exists, otherwise work_code"""
        return obj.service_request.service_number if obj.service_request else obj.work_code
    
    def get_customer_name(self, obj):
        return obj.client.get_full_name()

class ProjectSerializer(serializers.ModelSerializer):
    service_request = ServiceRequestSerializer(read_only=True)
    client = UserAccountSerializer(read_only=True)
    referral = UserAccountSerializer(read_only=True)
    stages = ProjectStageSerializer(many=True, read_only=True)
    updates = ProjectUpdateSerializer(many=True, read_only=True)
    documents = ProjectDocumentSerializer(many=True, read_only=True)
    team_members = ProjectTeamSerializer(many=True, read_only=True)
    budget_items = BudgetEstimateSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    package_display = serializers.CharField(source='get_package_display', read_only=True)
    progress = serializers.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    class Meta:
        model = Project
        fields = [
            'id', 'work_code', 'service_request', 'client', 'package', 'package_display',
            'status', 'status_display', 'start_date', 'estimated_completion',
            'actual_completion', 'area', 'budget', 'referral', 'special_instructions',
            'created_at', 'updated_at', 'progress', 'current_stage', 'stages', 
            'updates', 'documents', 'team_members', 'budget_items'
        ]
        read_only_fields = ['work_code', 'created_at', 'updated_at']

class ProjectListSerializer(serializers.ModelSerializer):
    service_request = serializers.SerializerMethodField()
    client = UserAccountSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    package_display = serializers.CharField(source='get_package_display', read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'work_code', 'service_request', 'client', 'package', 'package_display',
            'status', 'status_display', 'start_date', 'estimated_completion',
            'progress', 'current_stage'
        ]
    
    def get_service_request(self, obj):
        return obj.service_request.service_number if obj.service_request else None

class ProjectTimelineSerializer(serializers.Serializer):
    stages = ProjectStageSerializer(many=True)
    updates = ProjectUpdateSerializer(many=True)

class BudgetCalculatorSerializer(serializers.Serializer):
    area = serializers.FloatField(min_value=0)
    package = serializers.ChoiceField(choices=Project.PACKAGE_CHOICES)
    
    def calculate_budget(self):
        area = self.validated_data['area']
        package = self.validated_data['package']
        
        rates = {
            'STD': 1200,
            'PRE': 1800,
            'LUX': 2500
        }
        
        return area * rates.get(package, 0)