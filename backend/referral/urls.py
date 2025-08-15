# referral/urls.py
from django.urls import path
from .views import (
    ReferralStatsView,
    ReferralListView,
    WithdrawalRequestView
)

urlpatterns = [
    path('stats/', ReferralStatsView.as_view(), name='referral-stats'),
    path('list/', ReferralListView.as_view(), name='referral-list'),
    path('withdraw/', WithdrawalRequestView.as_view(), name='withdrawal-request'),
]