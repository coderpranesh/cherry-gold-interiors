# backend/projects/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet,
    ProjectStageViewSet,
    ProjectUpdateViewSet,
    ProjectImageViewSet,
    ProjectDocumentViewSet,
    ProjectTeamViewSet,
    BudgetEstimateViewSet,
    ProjectTimelineView,
    BudgetCalculatorView,
    ProjectTrackingView,
    ProjectByWorkCodeView,
    CreateProjectFromServiceView
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')

# Nested routes for project-specific resources
router.register(
    r'projects/(?P<project_id>\d+)/stages',
    ProjectStageViewSet,
    basename='project-stage'
)
router.register(
    r'projects/(?P<project_id>\d+)/updates',
    ProjectUpdateViewSet,
    basename='project-update'
)
router.register(
    r'projects/(?P<project_id>\d+)/documents',
    ProjectDocumentViewSet,
    basename='project-document'
)
router.register(
    r'projects/(?P<project_id>\d+)/team',
    ProjectTeamViewSet,
    basename='project-team'
)
router.register(
    r'projects/(?P<project_id>\d+)/budget-items',
    BudgetEstimateViewSet,
    basename='budget-estimate'
)
# Images nested under updates
router.register(
    r'projects/(?P<project_id>\d+)/updates/(?P<update_id>\d+)/images',
    ProjectImageViewSet,
    basename='project-image'
)

urlpatterns = [
    # Project tracking endpoint (public) - supports both service numbers and work codes
    path('track/<str:service_number>/', ProjectTrackingView.as_view(), name='project-tracking'),
    
    # Project creation from service request
    path('projects/from-service/', CreateProjectFromServiceView.as_view(), name='create-project-from-service'),
    
    # Project timeline
    path('projects/<int:project_id>/timeline/', ProjectTimelineView.as_view(), name='project-timeline'),
    
    # Budget calculator
    path('calculate-budget/', BudgetCalculatorView.as_view(), name='budget-calculator'),
    
    # Work code lookup (authenticated)
    path('projects/by-code/<str:work_code>/', ProjectByWorkCodeView.as_view(), name='project-by-code'),
    
    # Include all router URLs
    path('', include(router.urls)),
]