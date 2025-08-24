from django.contrib import admin
from .models import CostEstimation
from django.utils import timezone

@admin.register(CostEstimation)
class CostEstimationAdmin(admin.ModelAdmin):
    list_display = (
        'project_type', 
        'get_package_display', 
        'area', 
        'final_cost', 
        'created_at', 
        'expires_at',
        'has_contact_info'
    )
    list_filter = ('project_type', 'created_at', 'include_gst')
    readonly_fields = ('created_at',)
    search_fields = ('project_type', 'contact_name', 'contact_email', 'contact_phone')
    fieldsets = (
        ('Project Details', {
            'fields': (
                'project_type', 
                'kitchen_package', 
                'wall_paneling_package',
                'false_ceiling_type',
                'interior_package',
                'wardrobe_package'
            )
        }),
        ('Dimensions', {
            'fields': ('length', 'width', 'height', 'area')
        }),
        ('Cost Calculation', {
            'fields': (
                'base_price', 
                'features_total', 
                'subtotal', 
                'gst', 
                'final_cost',
                'include_gst'
            )
        }),
        ('Additional Information', {
            'fields': (
                'additional_features', 
                'package_description', 
                'package_features'
            )
        }),
        ('Contact Information', {
            'fields': (
                'contact_name', 
                'contact_email', 
                'contact_phone'
            )
        }),
        ('Metadata', {
            'fields': ('created_at', 'expires_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_package_display(self, obj):
        if obj.project_type == 'kitchen' and obj.kitchen_package:
            return f"Kitchen: {obj.kitchen_package}"
        elif obj.project_type == 'wall-paneling' and obj.wall_paneling_package:
            return f"Wall: {obj.wall_paneling_package}"
        elif obj.project_type == 'false-ceiling' and obj.false_ceiling_type:
            return f"Ceiling: {obj.false_ceiling_type}"
        elif obj.project_type == 'interior-decoration' and obj.interior_package:
            return f"Interior: {obj.interior_package}"
        elif obj.project_type == 'wardrobe' and obj.wardrobe_package:
            return f"Wardrobe: {obj.wardrobe_package}"
        return "Standard Package"
    get_package_display.short_description = 'Package'
    
    def has_contact_info(self, obj):
        return bool(obj.contact_name or obj.contact_email or obj.contact_phone)
    has_contact_info.boolean = True
    has_contact_info.short_description = 'Contact Info'
    
    def get_queryset(self, request):
        # Show only non-expired records by default
        qs = super().get_queryset(request)
        if not request.GET.get('show_expired'):
            qs = qs.filter(expires_at__gte=timezone.now())
        return qs