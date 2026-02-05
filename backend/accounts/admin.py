from django.contrib import admin, messages
from django.contrib.auth.admin import UserAdmin
from django.urls import reverse
from django.utils.html import format_html
from django.db.models.deletion import ProtectedError

from .models import User, EmailOTP, Referral, WithdrawalRequest
from .forms import CustomUserCreationForm


# =====================================================
# USER ADMIN
# =====================================================

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm

    list_display = (
        'username',
        'email',
        'phone',
        'email_verified',
        'wallet_balance_display',
        'referral_code',
        'referral_count',
        'created_by_admin',
        'is_active',
        'is_staff',
    )

    list_filter = (
        'is_staff',
        'is_superuser',
        'is_active',
        'email_verified',
        'created_by_admin',
        'date_joined',
    )

    search_fields = (
        'username',
        'email',
        'phone',
        'first_name',
        'last_name',
        'referral_code',
    )

    readonly_fields = ('date_joined', 'last_login', 'referral_code')
    ordering = ('-date_joined',)

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email', 'phone')}),
        ('Verification Status', {'fields': ('email_verified', 'phone_verified')}),
        ('Referral Info', {'fields': ('referral_code', 'referred_by', 'wallet_balance')}),
        ('Security', {'fields': ('email_otp_attempts', 'email_otp_last_sent')}),
        (
            'Permissions',
            {
                'fields': (
                    'is_active',
                    'is_staff',
                    'is_superuser',
                    'groups',
                    'user_permissions',
                    'created_by_admin',
                )
            },
        ),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': (
                    'username',
                    'email',
                    'phone',
                    'password1',
                    'password2',
                    'first_name',
                    'last_name',
                    'created_by_admin',
                ),
            },
        ),
    )

    # ---------- SAFE DISPLAY METHODS ----------

    def wallet_balance_display(self, obj):
        try:
            return f"₹{obj.wallet_balance or 0}"
        except Exception:
            return "₹0"
    wallet_balance_display.short_description = "Wallet Balance"

    def referral_count(self, obj):
        try:
            return obj.referrals_made.filter(status='paid').count()
        except Exception:
            return 0
    referral_count.short_description = "Paid Referrals"

    # ---------- DELETE PERMISSIONS ----------

    def has_delete_permission(self, request, obj=None):
        if not request.user.is_superuser:
            return False
        if obj and obj.id == request.user.id:
            return False
        return True

    # ---------- SINGLE DELETE ----------

    def delete_model(self, request, obj):
        if obj.is_superuser:
            messages.error(request, "Cannot delete superusers.")
            return

        if obj.id == request.user.id:
            messages.error(request, "You cannot delete your own account.")
            return

        try:
            super().delete_model(request, obj)
            messages.success(request, f"User '{obj.username}' deleted successfully.")

        except ProtectedError:
            messages.error(
                request,
                "Cannot delete this user because related records exist "
                "(referrals, withdrawals, or transactions)."
            )

        except Exception:
            messages.error(
                request,
                "Unexpected error occurred while deleting the user."
            )

    # ---------- BULK DELETE ----------

    def delete_queryset(self, request, queryset):
        if not request.user.is_superuser:
            messages.error(request, "Only superusers can delete users.")
            return

        deleted = 0
        skipped = 0

        for user in queryset:
            if user.id == request.user.id or user.is_superuser:
                skipped += 1
                continue

            try:
                user.delete()
                deleted += 1
            except ProtectedError:
                skipped += 1
            except Exception:
                skipped += 1

        if deleted:
            messages.success(request, f"{deleted} user(s) deleted successfully.")

        if skipped:
            messages.warning(
                request,
                f"{skipped} user(s) could not be deleted due to related data."
            )


# =====================================================
# EMAIL OTP ADMIN
# =====================================================

class EmailOTPAdmin(admin.ModelAdmin):
    list_display = (
        'email',
        'otp_display',
        'is_verified',
        'is_expired_safe',
        'created_at',
        'expires_at',
    )

    list_filter = ('is_verified', 'created_at')
    search_fields = ('email', 'otp')
    readonly_fields = ('created_at', 'expires_at', 'attempts')
    ordering = ('-created_at',)

    fieldsets = (
        (None, {'fields': ('email', 'otp')}),
        ('Status', {'fields': ('is_verified', 'attempts')}),
        ('Timestamps', {'fields': ('created_at', 'expires_at')}),
    )

    def otp_display(self, obj):
        try:
            return f"{obj.otp[:2]}****" if obj.otp else "—"
        except Exception:
            return "—"
    otp_display.short_description = "OTP"

    def is_expired_safe(self, obj):
        try:
            return obj.is_expired()
        except Exception:
            return False
    is_expired_safe.boolean = True
    is_expired_safe.short_description = "Expired"


# =====================================================
# REFERRAL ADMIN
# =====================================================

class ReferralAdmin(admin.ModelAdmin):
    list_display = (
        'referrer_link',
        'referred_user_link',
        'project_value',
        'reward_percentage',
        'reward_amount',
        'status',
        'created_at',
    )

    list_filter = ('status', 'reward_percentage', 'created_at')
    search_fields = (
        'referrer__username',
        'referrer__email',
        'referred_user__username',
        'referred_user__email',
    )

    readonly_fields = ('created_at', 'updated_at', 'paid_at')
    raw_id_fields = ('referrer', 'referred_user')
    list_editable = ('status',)
    actions = ('mark_as_paid', 'mark_as_completed')

    fieldsets = (
        ('Users', {'fields': ('referrer', 'referred_user')}),
        ('Commission Details', {'fields': ('project_value', 'reward_percentage', 'reward_amount')}),
        ('Status', {'fields': ('status', 'paid_at')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

    def referrer_link(self, obj):
        try:
            if not obj.referrer:
                return "—"
            url = reverse('admin:accounts_user_change', args=[obj.referrer_id])
            return format_html('<a href="{}">{}</a>', url, obj.referrer.username)
        except Exception:
            return "—"
    referrer_link.short_description = "Referrer"

    def referred_user_link(self, obj):
        try:
            if not obj.referred_user:
                return "—"
            url = reverse('admin:accounts_user_change', args=[obj.referred_user_id])
            return format_html('<a href="{}">{}</a>', url, obj.referred_user.username)
        except Exception:
            return "—"
    referred_user_link.short_description = "Referred User"

    def mark_as_paid(self, request, queryset):
        updated = 0
        for referral in queryset:
            try:
                if referral.mark_as_paid():
                    updated += 1
            except Exception:
                continue
        self.message_user(request, f"{updated} referral(s) marked as paid.")

    def mark_as_completed(self, request, queryset):
        try:
            queryset.update(status='completed')
            self.message_user(
                request,
                f"{queryset.count()} referral(s) marked as completed."
            )
        except Exception:
            messages.error(request, "Failed to complete referrals.")


# =====================================================
# WITHDRAWAL REQUEST ADMIN
# =====================================================

class WithdrawalRequestAdmin(admin.ModelAdmin):
    list_display = (
        'user_link',
        'amount',
        'fee',
        'net_amount',
        'status',
        'created_at',
        'processed_at',
    )

    list_filter = ('status', 'created_at', 'processed_at')

    search_fields = (
        'user__username',
        'user__email',
        'account_holder_name',
        'account_number',
        'pan_number',
    )

    readonly_fields = ('created_at', 'updated_at', 'processed_at')
    list_editable = ('status',)
    actions = ('approve_selected', 'reject_selected', 'process_selected')

    fieldsets = (
        ('User Info', {'fields': ('user',)}),
        ('Amount Details', {'fields': ('amount', 'fee', 'net_amount')}),
        (
            'Bank Details',
            {
                'fields': (
                    'account_holder_name',
                    'account_number',
                    'ifsc_code',
                    'bank_name',
                    'branch_name',
                    'pan_number',
                )
            },
        ),
        ('Status', {'fields': ('status', 'rejection_reason', 'admin_notes')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at', 'processed_at')}),
    )

    def user_link(self, obj):
        try:
            if not obj.user:
                return "—"
            url = reverse('admin:accounts_user_change', args=[obj.user_id])
            return format_html('<a href="{}">{}</a>', url, obj.user.username)
        except Exception:
            return "—"
    user_link.short_description = "User"

    def approve_selected(self, request, queryset):
        approved = 0
        for withdrawal in queryset.filter(status='pending'):
            try:
                if withdrawal.approve(request.user):
                    approved += 1
            except Exception:
                continue
        self.message_user(request, f"{approved} withdrawal(s) approved.")

    def reject_selected(self, request, queryset):
        try:
            queryset.filter(status='pending').update(status='rejected')
            self.message_user(
                request,
                f"{queryset.count()} withdrawal(s) rejected."
            )
        except Exception:
            messages.error(request, "Failed to reject withdrawals.")

    def process_selected(self, request, queryset):
        processed = 0
        for withdrawal in queryset.filter(status='approved'):
            try:
                if withdrawal.process():
                    processed += 1
            except Exception:
                continue
        self.message_user(
            request,
            f"{processed} withdrawal(s) marked as processed."
        )


# =====================================================
# REGISTER MODELS
# =====================================================

admin.site.register(User, CustomUserAdmin)
admin.site.register(EmailOTP, EmailOTPAdmin)
admin.site.register(Referral, ReferralAdmin)
admin.site.register(WithdrawalRequest, WithdrawalRequestAdmin)