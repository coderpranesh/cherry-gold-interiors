from rest_framework import serializers
from .models import (
    Project,
    ProjectStage,
    ProjectUpdate,
    ProjectDocument,
    ProjectTeam,
    BudgetEstimate,
)
from accounts.serializers import UserSerializer

class ProjectStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectStage
        fields = [
            'id', 'name', 'description', 'start_date', 
            'end_date', 'completed', 'completed_date'
        ]

class ProjectUpdateSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = ProjectUpdate
        fields = [
            'id', 'update_type', 'title', 'description',
            'created_by', 'created_at', 'requires_action',
            'action_completed'
        ]

class ProjectDocumentSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
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
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ProjectTeam
        fields = ['id', 'user', 'role', 'assigned_date', 'is_primary']

class BudgetEstimateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetEstimate
        fields = [
            'id', 'item_name', 'description', 'quantity',
            'unit', 'unit_price', 'total_price'
        ]

class ProjectSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    referral = UserSerializer(read_only=True)
    stages = ProjectStageSerializer(many=True, read_only=True)
    updates = ProjectUpdateSerializer(many=True, read_only=True)
    documents = ProjectDocumentSerializer(many=True, read_only=True)
    team_members = ProjectTeamSerializer(many=True, read_only=True)
    budget_items = BudgetEstimateSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    package_display = serializers.CharField(source='get_package_display', read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'work_code', 'client', 'package', 'package_display',
            'status', 'status_display', 'start_date', 'estimated_completion',
            'actual_completion', 'area', 'budget', 'referral', 'special_instructions',
            'created_at', 'updated_at', 'stages', 'updates', 'documents',
            'team_members', 'budget_items'
        ]
        read_only_fields = ['work_code', 'created_at', 'updated_at']

class ProjectListSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    package_display = serializers.CharField(source='get_package_display', read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'work_code', 'client', 'package', 'package_display',
            'status', 'status_display', 'start_date', 'estimated_completion'
        ]

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