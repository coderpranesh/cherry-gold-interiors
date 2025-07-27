from django.contrib import admin
from .models import (
    Project,
    ProjectStage,
    ProjectUpdate,
    ProjectDocument,
    ProjectTeam,
    BudgetEstimate
)

class ProjectStageInline(admin.TabularInline):
    model = ProjectStage
    extra = 0

class ProjectUpdateInline(admin.TabularInline):
    model = ProjectUpdate
    extra = 0

class ProjectDocumentInline(admin.TabularInline):
    model = ProjectDocument
    extra = 0

class ProjectTeamInline(admin.TabularInline):
    model = ProjectTeam
    extra = 0

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('work_code', 'client', 'package', 'status', 'start_date', 'estimated_completion')
    list_filter = ('package', 'status')
    search_fields = ('work_code', 'client__email')
    inlines = [ProjectStageInline, ProjectUpdateInline, ProjectDocumentInline, ProjectTeamInline]

@admin.register(BudgetEstimate)
class BudgetEstimateAdmin(admin.ModelAdmin):
    list_display = ('project', 'item_name', 'quantity', 'unit_price', 'total_price')
    search_fields = ('project__work_code', 'item_name')