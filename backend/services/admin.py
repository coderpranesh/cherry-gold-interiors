from django.contrib import admin
from .models import (
    ServiceRequest,
    ConsultationBooking,
    RepairRequest,
    OnSiteService
)

@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'service_type', 'status', 'created_at')
    list_filter = ('service_type', 'status')
    search_fields = ('user__email', 'description')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(ConsultationBooking)
class ConsultationBookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'consultation_type', 'scheduled_at', 'status')
    list_filter = ('consultation_type', 'status')
    search_fields = ('user__email', 'notes')

@admin.register(RepairRequest)
class RepairRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'item_name', 'urgency', 'status')
    list_filter = ('urgency', 'status')
    search_fields = ('user__email', 'item_name')

@admin.register(OnSiteService)
class OnSiteServiceAdmin(admin.ModelAdmin):
    list_display = ('user', 'service_type', 'preferred_date', 'status')
    list_filter = ('service_type', 'status')
    search_fields = ('user__email', 'address')