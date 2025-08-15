from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from django.conf import settings
from .models import User, Referral, WithdrawalRequest, OTPVerification
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    ReferralDashboardSerializer, WithdrawalRequestSerializer,
    OTPVerificationSerializer
)
import random
import requests
from datetime import datetime, timedelta
from decimal import Decimal

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Skip verification for admin-created users
        if not (request.user.is_staff or user.created_by_admin):
            # Generate and send OTP
            otp = str(random.randint(100000, 999999))
            OTPVerification.objects.create(phone=user.phone, otp=otp)
            send_otp(user.phone, otp)
            
            # Send email verification
            send_verification_email(user.email, user.id)
        
        return Response({
            "message": "User registered successfully.",
            "user": UserSerializer(user).data,
            "verification_required": not (request.user.is_staff or user.created_by_admin)
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            
            # Skip verification check for admin and admin-created users
            if not (user.is_staff or user.created_by_admin or user.phone_verified):
                return Response(
                    {"error": "Phone number not verified"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            login(request, user)
            token = "your-auth-token"  # Replace with actual token generation
            
            return Response({
                "message": "Login successful",
                "user": UserSerializer(user).data,
                "token": token
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    def post(self, request):
        serializer = OTPVerificationSerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            otp = serializer.validated_data['otp']
            
            try:
                otp_obj = OTPVerification.objects.filter(
                    phone=phone,
                    created_at__gte=datetime.now() - timedelta(minutes=10)
                ).latest('created_at')
                
                if otp_obj.otp == otp:
                    otp_obj.is_verified = True
                    otp_obj.save()
                    
                    # Mark user's phone as verified
                    user = User.objects.get(phone=phone)
                    user.phone_verified = True
                    user.save()
                    
                    return Response({"message": "OTP verified successfully"})
                return Response(
                    {"error": "Invalid OTP"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except OTPVerification.DoesNotExist:
                return Response(
                    {"error": "OTP expired or not found"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResendOTPView(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        if not phone:
            return Response(
                {"error": "Phone number is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Delete old OTPs
        OTPVerification.objects.filter(phone=phone).delete()
        
        # Generate and send new OTP
        otp = str(random.randint(100000, 999999))
        OTPVerification.objects.create(phone=phone, otp=otp)
        send_otp(phone, otp)
        
        return Response({"message": "OTP resent successfully"})

class ReferralDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        referrals = Referral.objects.filter(referrer=user).select_related('referred_user')
        
        total_earnings = sum(
            [r.reward_amount for r in referrals if r.status == 'paid'],
            Decimal('0.00')
        )
        
        serializer = ReferralDashboardSerializer({
            "referral_code": user.referral_code,
            "total_earnings": total_earnings,
            "available_balance": user.wallet_balance,
            "referrals": referrals
        })
        return Response(serializer.data)

class WithdrawalRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    @transaction.atomic
    def post(self, request):
        if request.user.wallet_balance < Decimal('500.00'):
            return Response(
                {"error": "Minimum withdrawal amount is ₹500"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        serializer = WithdrawalRequestSerializer(data=request.data)
        if serializer.is_valid():
            # Create withdrawal request
            withdrawal = WithdrawalRequest.objects.create(
                user=request.user,
                amount=request.user.wallet_balance,
                **serializer.validated_data
            )
            
            # Deduct from wallet (admin will approve/reject)
            request.user.wallet_balance = Decimal('0.00')
            request.user.save()
            
            # Notify admin (in production, send email/notification)
            
            return Response(
                {"message": "Withdrawal request submitted successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReferralCodeValidationView(APIView):
    def get(self, request):
        code = request.query_params.get('code')
        if not code:
            return Response(
                {"error": "Referral code is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(referral_code=code)
            return Response({
                "valid": True,
                "referrer_name": user.full_name
            })
        except User.DoesNotExist:
            return Response({
                "valid": False,
                "message": "Invalid referral code"
            })

def send_otp(phone, otp):
    if not settings.DEBUG:
        url = "https://www.fast2sms.com/dev/bulkV2"
        payload = {
            "route": "otp",
            "variables_values": otp,
            "numbers": phone,
            "flash": 0
        }
        headers = {
            'authorization': settings.FAST2SMS_API_KEY,
            'Content-Type': "application/json"
        }
        response = requests.post(url, json=payload, headers=headers)
        return response.json()
    print(f"DEBUG: OTP for {phone} is {otp}")  # For development
    return {"message": "OTP would be sent in production"}

def send_verification_email(email, user_id):
    # In production, implement email sending with verification link
    verification_link = f"{settings.FRONTEND_URL}/verify-email/{user_id}/"
    print(f"DEBUG: Email verification link for {email}: {verification_link}")