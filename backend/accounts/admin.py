# backend/accounts/admin.py - SIMPLEST APPROACH
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib import messages
from .models import User, Referral, WithdrawalRequest, OTPVerification
from .forms import CustomUserCreationForm

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    list_display = ('username', 'email', 'phone', 'wallet_balance', 'referral_code', 'referred_by', 'is_staff', 'created_by_admin')
    list_filter = ('is_staff', 'is_superuser', 'email_verified', 'phone_verified', 'created_by_admin')
    search_fields = ('username', 'email', 'phone', 'first_name', 'last_name')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email', 'phone')}),
        ('Referral Info', {'fields': ('referral_code', 'referred_by', 'wallet_balance')}),
        ('Verification', {'fields': ('email_verified', 'phone_verified', 'created_by_admin')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'phone', 'password1', 'password2', 'created_by_admin'),
        }),
    )
    
    def has_delete_permission(self, request, obj=None):
        # Only allow superusers to delete users
        return request.user.is_superuser
    
    def delete_model(self, request, obj):
        # Prevent deleting superusers
        if obj.is_superuser:
            messages.error(request, "Cannot delete superusers.")
            return
        
        # Prevent deleting own account
        if request.user.id == obj.id:
            messages.error(request, "You cannot delete your own account.")
            return
        
        # Proceed with deletion
        super().delete_model(request, obj)
        messages.success(request, f"User '{obj.username}' has been deleted successfully.")
    
    def save_model(self, request, obj, form, change):
        # If admin is creating the user, mark as verified
        if not change and request.user.is_staff:
            obj.created_by_admin = True
        super().save_model(request, obj, form, change)

# ... rest of your admin classes remain the same ...

class ReferralAdmin(admin.ModelAdmin):
    list_display = ('referrer', 'referred_user', 'project_value', 'reward_percentage', 'reward_amount', 'status')
    list_filter = ('status', 'reward_percentage')
    search_fields = ('referrer__username', 'referred_user__username')
    raw_id_fields = ('referrer', 'referred_user')

class WithdrawalRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('user__username', 'account_holder_name')
    list_editable = ('status',)
    actions = ['approve_withdrawals']

    def approve_withdrawals(self, request, queryset):
        queryset.filter(status='pending').update(status='approved')
        self.message_user(request, "Selected withdrawals have been approved")
    approve_withdrawals.short_description = "Approve selected withdrawals"

admin.site.register(User, CustomUserAdmin)
admin.site.register(Referral, ReferralAdmin)
admin.site.register(WithdrawalRequest, WithdrawalRequestAdmin)
admin.site.register(OTPVerification)