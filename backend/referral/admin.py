from django.contrib import admin
from django.utils import timezone
from .models import Referral, ReferralReward, WithdrawalRequest

@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = ('referrer', 'referee_name', 'project_type', 'project_value', 'status')
    list_filter = ('status', 'project_type')
    search_fields = ('referrer__email', 'referee_name', 'referee_email')

@admin.register(ReferralReward)
class ReferralRewardAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_earned', 'total_paid', 'pending_amount')
    search_fields = ('user__email',)

@admin.register(WithdrawalRequest)
class WithdrawalRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('user__email', 'bank_account_number')
    actions = ['mark_as_processed']

    def mark_as_processed(self, request, queryset):
        updated = queryset.filter(status='approved').update(
            status='processed',
            processed_at=timezone.now()
        )
        self.message_user(request, f"{updated} withdrawals marked as processed")
    mark_as_processed.short_description = "Mark selected as processed"