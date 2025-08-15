# referral/serializers.py
from rest_framework import serializers
from .models import Referral, ReferralReward, WithdrawalRequest

class ReferralSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Referral
        fields = [
            'id', 'referee_name', 'project_type', 'project_value',
            'status', 'status_display', 'reward_amount', 'created_at'
        ]

class ReferralRewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferralReward
        fields = ['total_earned', 'total_paid', 'pending_amount', 'referral_code']

class WithdrawalRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = WithdrawalRequest
        fields = [
            'amount', 'bank_account_number', 'bank_name',
            'ifsc_code', 'pan_number'
        ]
        extra_kwargs = {
            'amount': {'min_value': 1000}
        }