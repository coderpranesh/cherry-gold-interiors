
# backend/accounts/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, VerifyOTPView, ResendOTPView,
    ReferralDashboardView, WithdrawalRequestView, ReferralCodeValidationView,
    admin_delete_user
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend-otp'),
    path('referrals/', ReferralDashboardView.as_view(), name='referral-dashboard'),
    path('withdraw/', WithdrawalRequestView.as_view(), name='withdraw-request'),
    path('validate-referral/', ReferralCodeValidationView.as_view(), name='validate-referral'),
    path('admin/delete-user/<int:user_id>/', admin_delete_user, name='admin-delete-user'),
]