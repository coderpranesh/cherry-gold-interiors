from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from .views import (
    # Auth Views
    RegisterView, LoginView, VerifyEmailOTPView, ResendEmailOTPView,
    
    # Profile Views
    ProfileView, ChangePasswordView,
    
    # Referral Views
    ReferralDashboardView, ReferralCodeValidationView,
    
    # Withdrawal Views
    WithdrawalRequestView, BankDetailValidationView,
    
    # Admin Views
    admin_delete_user,
    
    # Health Check
    health_check,
)

urlpatterns = [
    # ========== Authentication ==========
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # ========== Email Verification ==========
    path('verify-email/', VerifyEmailOTPView.as_view(), name='verify-email'),
    path('resend-otp/', ResendEmailOTPView.as_view(), name='resend-otp'),
    
    # ========== Profile Management ==========
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    
    # ========== Referral System ==========
    path('referrals/dashboard/', ReferralDashboardView.as_view(), name='referral-dashboard'),
    path('referrals/validate/', ReferralCodeValidationView.as_view(), name='validate-referral'),
    
    # ========== Withdrawal System ==========
    path('withdrawals/', WithdrawalRequestView.as_view(), name='withdrawals'),
    path('withdrawals/validate-bank/', BankDetailValidationView.as_view(), name='validate-bank'),
    
    # ========== Admin Functions ==========
    path('admin/delete-user/<int:user_id>/', admin_delete_user, name='admin-delete-user'),
    
    # ========== Health Check ==========
    path('health/', health_check, name='health-check'),
]