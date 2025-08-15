# backend/projects/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Project,
    ProjectStage,
    ProjectUpdate,
    ProjectImage,
    ProjectDocument,
    ProjectTeam,
    BudgetEstimate
)
from services.models import ServiceRequest

class ServiceRequestFilter(admin.SimpleListFilter):
    title = 'service request'
    parameter_name = 'has_service_request'
    
    def lookups(self, request, model_admin):
        return (
            ('yes', 'Has Service Request'),
            ('no', 'No Service Request'),
        )
    
    def queryset(self, request, queryset):
        if self.value() == 'yes':
            return queryset.filter(service_request__isnull=False)
        if self.value() == 'no':
            return queryset.filter(service_request__isnull=True)

class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 0
    readonly_fields = ('image_preview',)
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px;"/>', obj.image.url)
        return "-"
    image_preview.short_description = "Preview"

class ProjectUpdateInline(admin.StackedInline):
    model = ProjectUpdate
    extra = 0
    show_change_link = True
    inlines = [ProjectImageInline]
    fields = ('update_type', 'title', 'description', 'created_by', 'created_at')
    readonly_fields = ('created_by', 'created_at')

class ProjectStageInline(admin.TabularInline):
    model = ProjectStage
    extra = 0
    fields = ('name', 'status', 'start_date', 'end_date', 'completed', 'completed_date')
    readonly_fields = ('completed_date',)

class ProjectDocumentInline(admin.TabularInline):
    model = ProjectDocument
    extra = 0
    readonly_fields = ('document_preview',)
    
    def document_preview(self, obj):
        if obj.file:
            return format_html('<a href="{}" target="_blank">View Document</a>', obj.file.url)
        return "-"
    document_preview.short_description = "Preview"

class ProjectTeamInline(admin.TabularInline):
    model = ProjectTeam
    extra = 0
    autocomplete_fields = ('user',)

class BudgetEstimateInline(admin.TabularInline):
    model = BudgetEstimate
    extra = 0
    fields = ('item_name', 'quantity', 'unit', 'unit_price', 'total_price')
    readonly_fields = ('total_price',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        'work_code', 
        'service_number',
        'client', 
        'package_display', 
        'status_display',
        'progress_bar',
        'start_date', 
        'estimated_completion'
    )
    list_filter = (ServiceRequestFilter, 'package', 'status', 'start_date')
    search_fields = (
        'work_code', 
        'service_request__service_number',
        'client__email', 
        'client__first_name', 
        'client__last_name'
    )
    inlines = [
        ProjectStageInline, 
        ProjectUpdateInline, 
        ProjectDocumentInline, 
        ProjectTeamInline,
        BudgetEstimateInline
    ]
    readonly_fields = ('created_at', 'updated_at', 'work_code', 'service_number')
    autocomplete_fields = ['service_request', 'client', 'referral']
    
    fieldsets = (
        ('Service Information', {
            'fields': ('service_request', 'work_code', 'service_number')
        }),
        ('Project Details', {
            'fields': ('client', 'package', 'status', 'progress', 'current_stage')
        }),
        ('Dates & Completion', {
            'fields': ('start_date', 'estimated_completion', 'actual_completion')
        }),
        ('Financials', {
            'fields': ('area', 'budget', 'referral')
        }),
        ('Other Information', {
            'fields': ('special_instructions', 'created_at', 'updated_at')
        }),
    )
    
    def service_number(self, obj):
        return obj.service_request.service_number if obj.service_request else "N/A"
    service_number.short_description = 'Service Number'
    service_number.admin_order_field = 'service_request__service_number'
    
    def package_display(self, obj):
        return obj.get_package_display()
    package_display.short_description = 'Package'
    
    def status_display(self, obj):
        return obj.get_status_display()
    status_display.short_description = 'Status'
    
    def progress_bar(self, obj):
        color = '#4CAF50'  # Green
        if obj.progress < 30:
            color = '#F44336'  # Red
        elif obj.progress < 70:
            color = '#FFC107'  # Yellow
            
        return format_html(
            '<div style="width:100px;background:#ddd;border-radius:5px;">'
            '<div style="width:{}%;background:{};height:20px;border-radius:5px;'
            'text-align:center;color:white;font-weight:bold;">{}%</div>'
            '</div>',
            obj.progress, color, obj.progress
        )
    progress_bar.short_description = 'Progress'
    progress_bar.admin_order_field = 'progress'

@admin.register(ProjectStage)
class ProjectStageAdmin(admin.ModelAdmin):
    list_display = ('name', 'project_link', 'status_display', 'start_date', 'end_date', 'is_completed')
    list_filter = ('status', 'completed', 'start_date')
    search_fields = ('project__work_code', 'name', 'project__service_request__service_number')
    list_select_related = ('project', 'project__service_request')
    
    def project_link(self, obj):
        return format_html(
            '<a href="/admin/projects/project/{}/change/">{}</a>',
            obj.project.id,
            obj.project.work_code
        )
    project_link.short_description = 'Project'
    project_link.admin_order_field = 'project__work_code'
    
    def status_display(self, obj):
        return obj.get_status_display()
    status_display.short_description = 'Status'
    
    def is_completed(self, obj):
        return obj.completed
    is_completed.boolean = True
    is_completed.short_description = 'Completed'

@admin.register(ProjectUpdate)
class ProjectUpdateAdmin(admin.ModelAdmin):
    list_display = ('title', 'project_link', 'update_type_display', 'created_at', 'has_images')
    list_filter = ('update_type', 'created_at', 'requires_action')
    search_fields = ('project__work_code', 'title', 'project__service_request__service_number')
    readonly_fields = ('created_by', 'created_at')
    list_select_related = ('project', 'project__service_request')
    
    def project_link(self, obj):
        return format_html(
            '<a href="/admin/projects/project/{}/change/">{}</a>',
            obj.project.id,
            obj.project.work_code
        )
    project_link.short_description = 'Project'
    project_link.admin_order_field = 'project__work_code'
    
    def update_type_display(self, obj):
        return obj.get_update_type_display()
    update_type_display.short_description = 'Type'
    
    def has_images(self, obj):
        return obj.images.exists()
    has_images.boolean = True
    has_images.short_description = 'Has Images'

@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ('update_link', 'image_preview', 'uploaded_at')
    readonly_fields = ('image_preview', 'uploaded_at')
    search_fields = ('update__title', 'update__project__work_code', 'update__project__service_request__service_number')
    list_select_related = ('update__project', 'update__project__service_request')
    
    def update_link(self, obj):
        return format_html(
            '<a href="/admin/projects/projectupdate/{}/change/">{}</a>',
            obj.update.id,
            obj.update.title
        )
    update_link.short_description = 'Update'
    update_link.admin_order_field = 'update__title'
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px;"/>', obj.image.url)
        return "-"
    image_preview.short_description = "Preview"

@admin.register(ProjectDocument)
class ProjectDocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'project_link', 'document_type_display', 'uploaded_at', 'document_link')
    list_filter = ('document_type', 'uploaded_at')
    search_fields = ('project__work_code', 'title', 'project__service_request__service_number')
    readonly_fields = ('document_link', 'uploaded_at', 'uploaded_by')
    list_select_related = ('project', 'project__service_request')
    
    def project_link(self, obj):
        return format_html(
            '<a href="/admin/projects/project/{}/change/">{}</a>',
            obj.project.id,
            obj.project.work_code
        )
    project_link.short_description = 'Project'
    project_link.admin_order_field = 'project__work_code'
    
    def document_type_display(self, obj):
        return obj.get_document_type_display()
    document_type_display.short_description = 'Type'
    
    def document_link(self, obj):
        if obj.file:
            return format_html(
                '<a href="{}" target="_blank" style="padding: 3px 6px; background: #4CAF50; color: white; border-radius: 3px;">Download</a>',
                obj.file.url
            )
        return "-"
    document_link.short_description = "File"

@admin.register(ProjectTeam)
class ProjectTeamAdmin(admin.ModelAdmin):
    list_display = ('user', 'project_link', 'role_display', 'is_primary', 'assigned_date')
    list_filter = ('role', 'is_primary', 'assigned_date')
    search_fields = ('project__work_code', 'user__email', 'project__service_request__service_number')
    autocomplete_fields = ('user', 'project')
    list_select_related = ('project', 'project__service_request', 'user')
    
    def project_link(self, obj):
        return format_html(
            '<a href="/admin/projects/project/{}/change/">{}</a>',
            obj.project.id,
            obj.project.work_code
        )
    project_link.short_description = 'Project'
    project_link.admin_order_field = 'project__work_code'
    
    def role_display(self, obj):
        return obj.get_role_display()
    role_display.short_description = 'Role'

@admin.register(BudgetEstimate)
class BudgetEstimateAdmin(admin.ModelAdmin):
    list_display = ('project_link', 'item_name', 'quantity', 'unit', 'unit_price', 'total_price')
    list_filter = ('unit',)
    search_fields = ('project__work_code', 'item_name', 'project__service_request__service_number')
    readonly_fields = ('total_price',)
    list_select_related = ('project', 'project__service_request')
    
    def project_link(self, obj):
        return format_html(
            '<a href="/admin/projects/project/{}/change/">{}</a>',
            obj.project.id,
            obj.project.work_code
        )
    project_link.short_description = 'Project'
    project_link.admin_order_field = 'project__work_code'