# backend/services/admin.py
from django.contrib import admin
from .models import ServiceRequest, ServiceSequence
from django.utils.html import format_html
from django.urls import reverse
from django.db.models import Q
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.template.loader import render_to_string
from django.utils.html import strip_tags


class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = (
        'service_number_link',
        'full_name',
        'service_type_display',
        'formatted_phone',
        'created_at_short',
        'status_badge',
        'status_changed_short',
        'admin_actions'
    )
    list_filter = (
        'service_type',
        'status',
        'created_at',
        'project_type'
    )
    search_fields = (
        'full_name',
        'phone_number',
        'email',
        'service_number',
        'issue_description'
    )
    readonly_fields = (
        'created_at',
        'updated_at',
        'service_number',
        'service_type_display',
        'preferred_time_display',
        'status_display',
        'status_changed'
    )
    list_per_page = 25
    date_hierarchy = 'created_at'
    list_select_related = True
    actions = [
        'mark_as_completed',
        'mark_as_in_progress',
        'mark_as_on_hold',
        'send_status_email'
    ]
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'service_type',
                'service_type_display',
                'full_name',
                'phone_number',
                'email'
            )
        }),
        ('Service Details', {
            'fields': (
                'service_number',
                'issue_description',
                'project_type',
                'project_details'
            )
        }),
        ('Appointment Details', {
            'fields': (
                'preferred_date',
                'preferred_time',
                'preferred_time_display',
                'complete_address'
            )
        }),
        ('Status', {
            'fields': (
                'status',
                'status_display',
                'status_changed',
                'notes'
            )
        }),
        ('Metadata', {
            'fields': (
                'created_at',
                'updated_at'
            ),
            'classes': ('collapse',)
        }),
    )

    def service_type_display(self, obj):
        return obj.get_service_type_display()
    service_type_display.short_description = 'Service Type'
    service_type_display.admin_order_field = 'service_type'

    def preferred_time_display(self, obj):
        return obj.get_preferred_time_display()
    preferred_time_display.short_description = 'Time Slot'

    def status_display(self, obj):
        return obj.get_status_display()
    status_display.short_description = 'Status'

    def service_number_link(self, obj):
        url = reverse('admin:services_servicerequest_change', args=[obj.id])
        return format_html('<a href="{}">{}</a>', url, obj.service_number)
    service_number_link.short_description = 'Service Number'
    service_number_link.admin_order_field = 'service_number'

    def formatted_phone(self, obj):
        return format_html('<a href="tel:{}">{}</a>', obj.phone_number, obj.phone_number)
    formatted_phone.short_description = 'Phone'
    formatted_phone.admin_order_field = 'phone_number'

    def created_at_short(self, obj):
        return obj.created_at.strftime('%Y-%m-%d')
    created_at_short.short_description = 'Created'
    created_at_short.admin_order_field = 'created_at'

    def status_changed_short(self, obj):
        if obj.status_changed:
            return obj.status_changed.strftime('%Y-%m-%d')
        return ''
    status_changed_short.short_description = 'Status Changed'
    status_changed_short.admin_order_field = 'status_changed'

    def status_badge(self, obj):
        status_colors = {
            'new': '#17a2b8',        # Cyan
            'in_progress': '#007bff', # Blue
            'on_hold': '#6c757d',     # Gray
            'completed': '#28a745',   # Green
            'cancelled': '#dc3545'    # Red
        }
        return format_html(
            '<span style="padding: 3px 8px; background: {}; color: white; border-radius: 12px; font-size: 12px;">{}</span>',
            status_colors.get(obj.status, '#6c757d'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    status_badge.admin_order_field = 'status'

    def admin_actions(self, obj):
        return format_html(
            '<a class="button" href="{}">Edit</a>&nbsp;'
            '<a class="button" href="{}" target="_blank">View</a>',
            reverse('admin:services_servicerequest_change', args=[obj.id]),
            reverse('services:request-detail', kwargs={'service_number': obj.service_number})
        )
    admin_actions.short_description = 'Actions'
    admin_actions.allow_tags = True

    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status='completed', status_changed=timezone.now())
        self.message_user(
            request,
            f'Successfully marked {updated} service request(s) as completed.',
            messages.SUCCESS
        )
    mark_as_completed.short_description = "Mark selected as completed"

    def mark_as_in_progress(self, request, queryset):
        updated = queryset.update(status='in_progress', status_changed=timezone.now())
        self.message_user(
            request,
            f'Successfully marked {updated} service request(s) as in progress.',
            messages.SUCCESS
        )
    mark_as_in_progress.short_description = "Mark selected as in progress"

    def mark_as_on_hold(self, request, queryset):
        updated = queryset.update(status='on_hold', status_changed=timezone.now())
        self.message_user(
            request,
            f'Successfully marked {updated} service request(s) as on hold.',
            messages.SUCCESS
        )
    mark_as_on_hold.short_description = "Mark selected as on hold"

    def send_status_email(self, request, queryset):
        sent_count = 0
        for service_request in queryset:
            if service_request.email:
                try:
                    context = {
                        'service_request': service_request,
                        'contact_email': settings.CONTACT_EMAIL,
                        'site_name': settings.SITE_NAME,
                        'service_number': service_request.service_number,
                        'status': service_request.get_status_display(),
                        'status_changed': service_request.status_changed.strftime('%Y-%m-%d %H:%M')
                    }
                    
                    subject = f"Update on Your Service Request {service_request.service_number}"
                    html_message = render_to_string('emails/admin_status_update.html', context)
                    plain_message = strip_tags(html_message)
                    
                    send_mail(
                        subject=subject,
                        message=plain_message,
                        html_message=html_message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[service_request.email],
                        fail_silently=False,
                    )
                    sent_count += 1
                except Exception as e:
                    self.message_user(
                        request,
                        f"Failed to send email for {service_request.service_number}: {str(e)}",
                        messages.ERROR
                    )
        
        self.message_user(
            request,
            f"Successfully sent status emails to {sent_count} customer(s).",
            messages.SUCCESS
        )
    send_status_email.short_description = "Send status update email"

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.GET.get('urgent'):
            return qs.filter(
                Q(status__in=['new', 'in_progress']) & 
                Q(preferred_date__isnull=False) &
                Q(preferred_date__lte=timezone.now() + timezone.timedelta(days=3))
            )
        return qs

    def get_list_display_links(self, request, list_display):
        return ['service_number_link']

    def get_ordering(self, request):
        return ['-created_at']

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return self.readonly_fields + ('service_type',)
        return self.readonly_fields

    def save_model(self, request, obj, form, change):
        if 'status' in form.changed_data:
            obj.status_changed = timezone.now()
        super().save_model(request, obj, form, change)

class ServiceSequenceAdmin(admin.ModelAdmin):
    list_display = ('year_month', 'last_sequence', 'next_service_number')
    readonly_fields = ('year_month', 'last_sequence', 'next_service_number')
    ordering = ('-year_month',)
    
    def next_service_number(self, obj):
        return f"CG{obj.year_month}{obj.last_sequence + 1:04d}"
    next_service_number.short_description = 'Next Service Number'

    def has_add_permission(self, request):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False

admin.site.register(ServiceRequest, ServiceRequestAdmin)
admin.site.register(ServiceSequence, ServiceSequenceAdmin)