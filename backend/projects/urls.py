from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet,
    ProjectStageViewSet,
    ProjectUpdateViewSet,
    ProjectDocumentViewSet,
    ProjectTeamViewSet,
    BudgetEstimateViewSet,
    ProjectTimelineView,
    BudgetCalculatorView,
    ProjectByWorkCodeView,
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'stages', ProjectStageViewSet, basename='projectstage')
router.register(r'updates', ProjectUpdateViewSet, basename='projectupdate')
router.register(r'documents', ProjectDocumentViewSet, basename='projectdocument')
router.register(r'team', ProjectTeamViewSet, basename='projectteam')
router.register(r'budget-items', BudgetEstimateViewSet, basename='budgetestimate')

urlpatterns = [
    path('timeline/<int:project_id>/', ProjectTimelineView.as_view(), name='project-timeline'),
    path('calculate-budget/', BudgetCalculatorView.as_view(), name='budget-calculator'),
    path('work-code/<str:work_code>/', ProjectByWorkCodeView.as_view(), name='project-by-workcode'),
] + router.urls