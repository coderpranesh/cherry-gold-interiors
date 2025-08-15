# referral/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from .models import Referral, ReferralReward, WithdrawalRequest
from .serializers import (
    ReferralSerializer,
    ReferralRewardSerializer,
    WithdrawalRequestSerializer
)

class ReferralStatsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reward = ReferralReward.objects.get(user=request.user)
        referrals = Referral.objects.filter(referrer=request.user)
        
        data = {
            'totalReferrals': referrals.count(),
            'totalEarnings': referrals.filter(status='completed')
                                .aggregate(Sum('reward_amount'))['reward_amount__sum'] or 0,
            'pendingRewards': referrals.filter(status='confirmed')
                                .aggregate(Sum('reward_amount'))['reward_amount__sum'] or 0,
            'referralCode': reward.referral_code,
            'minWithdrawalAmount': 1000
        }
        return Response(data)

class ReferralListView(generics.ListAPIView):
    serializer_class = ReferralSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Referral.objects.filter(referrer=self.request.user).order_by('-created_at')

class WithdrawalRequestView(generics.CreateAPIView):
    serializer_class = WithdrawalRequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        reward = ReferralReward.objects.get(user=self.request.user)
        amount = serializer.validated_data['amount']
        
        if amount < 1000:
            return Response(
                {'detail': 'Minimum withdrawal amount is ₹1000'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if amount > reward.pending_amount:
            return Response(
                {'detail': 'Amount exceeds available balance'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reward.pending_amount -= amount
        reward.save()
        serializer.save(user=self.request.user)