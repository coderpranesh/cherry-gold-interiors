from rest_framework import viewsets, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import (
    Project,
    ProjectStage,
    ProjectUpdate,
    ProjectDocument,
    ProjectTeam,
    BudgetEstimate,
)
from .serializers import (
    ProjectSerializer,
    ProjectListSerializer,
    ProjectStageSerializer,
    ProjectUpdateSerializer,
    ProjectDocumentSerializer,
    ProjectTeamSerializer,
    BudgetEstimateSerializer,
    ProjectTimelineSerializer,
    BudgetCalculatorSerializer,
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
            return Project.objects.all()
        return Project.objects.filter(client=user)
    
    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

class ProjectStageViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectStageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ProjectStage.objects.filter(project_id=self.kwargs.get('project_id'))
    
    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs.get('project_id'))
        serializer.save(project=project)

class ProjectUpdateViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ProjectUpdate.objects.filter(project_id=self.kwargs.get('project_id'))
    
    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs.get('project_id'))
        serializer.save(project=project, created_by=self.request.user)

class ProjectDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectDocumentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ProjectDocument.objects.filter(project_id=self.kwargs.get('project_id'))
    
    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs.get('project_id'))
        serializer.save(project=project, uploaded_by=self.request.user)

class ProjectTeamViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectTeamSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ProjectTeam.objects.filter(project_id=self.kwargs.get('project_id'))
    
    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs.get('project_id'))
        serializer.save(project=project)

class BudgetEstimateViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetEstimateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return BudgetEstimate.objects.filter(project_id=self.kwargs.get('project_id'))
    
    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs.get('project_id'))
        serializer.save(project=project)

class ProjectTimelineView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)
        
        if not (request.user.is_staff or project.client == request.user):
            return Response({'error': 'Not authorized to view this project'}, 
                          status=403)
        
        stages = ProjectStage.objects.filter(project=project)
        updates = ProjectUpdate.objects.filter(project=project)
        
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