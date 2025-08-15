# backend/projects/views.py
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
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
from .serializers import (
    ProjectSerializer,
    ProjectListSerializer,
    ProjectStageSerializer,
    ProjectUpdateSerializer,
    ProjectImageSerializer,
    ProjectDocumentSerializer,
    ProjectTeamSerializer,
    BudgetEstimateSerializer,
    ProjectTimelineSerializer,
    BudgetCalculatorSerializer,
    ProjectTrackingSerializer,
)
from accounts.models import User

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Project.objects.all().order_by('-start_date')
        return Project.objects.filter(client=user).order_by('-start_date')
    
    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

class ProjectStageViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectStageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ProjectStage.objects.filter(
            project_id=self.kwargs.get('project_id')
        ).order_by('order')
    
    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs.get('project_id'))
        serializer.save(project=project)

class ProjectUpdateViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ProjectUpdate.objects.filter(
            project_id=self.kwargs.get('project_id')
        ).order_by('-created_at')
    
    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs.get('project_id'))
        serializer.save(project=project, created_by=self.request.user)

class ProjectImageViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectImageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        update_id = self.kwargs.get('update_id')
        return ProjectImage.objects.filter(update_id=update_id)
    
    def perform_create(self, serializer):
        update = get_object_or_404(ProjectUpdate, id=self.kwargs.get('update_id'))
        serializer.save(update=update)

class ProjectDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectDocumentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ProjectDocument.objects.filter(
            project_id=self.kwargs.get('project_id')
        ).order_by('-uploaded_at')
    
    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs.get('project_id'))
        serializer.save(project=project, uploaded_by=self.request.user)

class ProjectTeamViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectTeamSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ProjectTeam.objects.filter(
            project_id=self.kwargs.get('project_id')
        ).order_by('-is_primary', 'role')
    
    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs.get('project_id'))
        serializer.save(project=project)

class BudgetEstimateViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetEstimateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return BudgetEstimate.objects.filter(
            project_id=self.kwargs.get('project_id')
        ).order_by('item_name')
    
    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs.get('project_id'))
        serializer.save(project=project)

class ProjectTimelineView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)
        
        if not (request.user.is_staff or project.client == request.user):
            return Response(
                {'error': 'Not authorized to view this project'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        stages = ProjectStage.objects.filter(project=project).order_by('order')
        updates = ProjectUpdate.objects.filter(project=project).order_by('-created_at')
        
        serializer = ProjectTimelineSerializer({
            'stages': stages,
            'updates': updates
        })
        
        return Response(serializer.data)

class BudgetCalculatorView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BudgetCalculatorSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        budget = serializer.calculate_budget()
        return Response({'budget': budget})

class ProjectTrackingView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProjectTrackingSerializer
    
    def get_object(self):
        service_number = self.kwargs.get('service_number')
        
        # First try to find by service request number
        try:
            service_request = ServiceRequest.objects.get(service_number=service_number)
            project = get_object_or_404(Project, service_request=service_request)
            return project
        except ServiceRequest.DoesNotExist:
            pass
        
        # Fallback to work code if no service request found
        project = get_object_or_404(Project, work_code=service_number)
        return project

class ProjectByWorkCodeView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProjectSerializer
    lookup_field = 'work_code'
    queryset = Project.objects.all()
    
    def get_object(self):
        work_code = self.kwargs.get('work_code')
        project = get_object_or_404(Project, work_code=work_code)
        
        if not (self.request.user.is_staff or project.client == self.request.user):
            self.permission_denied(self.request)
        
        return project

class CreateProjectFromServiceView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProjectSerializer
    
    def create(self, request, *args, **kwargs):
        service_request_id = request.data.get('service_request_id')
        if not service_request_id:
            return Response(
                {'error': 'service_request_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            service_request = ServiceRequest.objects.get(pk=service_request_id)
        except ServiceRequest.DoesNotExist:
            return Response(
                {'error': 'Service request not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if Project.objects.filter(service_request=service_request).exists():
            return Response(
                {'error': 'Project already exists for this service request'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create the project with data from service request
        project_data = {
            'service_request': service_request.id,
            'client': service_request.user.id,
            'package': 'STD',  # Default package
            'status': 'CONSULT',
            'start_date': request.data.get('start_date'),
            'estimated_completion': request.data.get('estimated_completion'),
            'special_instructions': service_request.notes or ''
        }
        
        serializer = self.get_serializer(data=project_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
