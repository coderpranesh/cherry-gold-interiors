from django.urls import path
from .views import (
    RegisterView, LoginView, VerifyOTPView, ResendOTPView,
    ReferralDashboardView, WithdrawalRequestView, ReferralCodeValidationView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend-otp'),
    path('referrals/', ReferralDashboardView.as_view(), name='referral-dashboard'),
    path('withdraw/', WithdrawalRequestView.as_view(), name='withdraw-request'),
    path('validate-referral/', ReferralCodeValidationView.as_view(), name='validate-referral'),
    
]