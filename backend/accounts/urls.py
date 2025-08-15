
#backend/accounts/urls.py
from django.urls import path
from .views import (
    UserRegistrationView,
    VerifyOTPView,
    UserLoginView,
    UserProfileView,
    ReferAndEarnView,
    WithdrawalRequestView,
    AdminUserListView,
    AdminReferralListView,
    AdminWithdrawalListView,
    AdminProcessWithdrawalView
)

urlpatterns = [
    # Authentication
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('login/', UserLoginView.as_view(), name='login'),
    
    # User endpoints
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('referrals/', ReferAndEarnView.as_view(), name='referrals'),
    path('withdraw/', WithdrawalRequestView.as_view(), name='withdraw'),
    
    # Admin endpoints
    path('admin/users/', AdminUserListView.as_view(), name='admin-users'),
    path('admin/referrals/', AdminReferralListView.as_view(), name='admin-referrals'),
    path('admin/withdrawals/', AdminWithdrawalListView.as_view(), name='admin-withdrawals'),
    path('admin/withdrawals/<int:pk>/process/', AdminProcessWithdrawalView.as_view(), name='admin-process-withdrawal'),
]