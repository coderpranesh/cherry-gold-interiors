
#backend/accounts/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
from django.core.mail import send_mail
from django.conf import settings
from .models import User, Referral, WithdrawalRequest
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    VerifyOTPSerializer,
    UserProfileSerializer,
    ReferralSerializer,
    WithdrawalRequestSerializer,
    ReferralDataSerializer
)
from accounts.utils import send_otp_sms
from rest_framework.exceptions import ValidationError
from rest_framework.authentication import TokenAuthentication

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            # Send verification email
            send_mail(
                'Verify Your Email - OTP',
                f'Your verification OTP is: {user.otp}\n\nThis OTP is valid for 5 minutes.',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            
            # Send SMS via MSG91
            if hasattr(settings, 'MSG91_AUTH_KEY') and settings.MSG91_AUTH_KEY:
                send_otp_sms(user.phone, user.otp)
            
            return Response({
                'message': 'Registration successful. Please check your email and phone for OTP.',
                'email': user.email,
                'phone': user.phone
            }, status=status.HTTP_201_CREATED)
            
        except ValidationError as e:
            return Response({'errors': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserProfileSerializer(user).data,
                'message': 'Account verified successfully!'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # Disable authentication for login view

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']  # Get the user from validated data
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'phone': user.phone,
                    'is_verified': user.is_verified
                },
                'message': 'Login successful!'
            }, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_object(self):
        return self.request.user

class ReferAndEarnView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        user = request.user
        data = {
            'name': user.username,
            'referral_code': user.referral_code,
            'balance': user.balance,
            'pending_balance': user.pending_balance,
            'min_withdrawal': 1000,  # Rs. 1000 minimum withdrawal
            'referral_amount': 500,   # Rs. 500 per referral
            'total_referrals': Referral.objects.filter(referrer=user).count(),
            'completed_referrals': Referral.objects.filter(referrer=user, is_completed=True).count()
        }
        serializer = ReferralDataSerializer(data)
        return Response(serializer.data)

    def post(self, request):
        serializer = ReferralSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            referral = serializer.save(referrer=request.user)
            # In a real app, you would verify the transaction first
            referral.amount_earned = 500  # Rs. 500 per referral
            referral.save()
            
            # Update user's pending balance
            user = request.user
            user.pending_balance += referral.amount_earned
            user.save()
            
            return Response({
                'message': 'Referral submitted successfully!',
                'referral_id': referral.id,
                'pending_balance': user.pending_balance
            }, status=status.HTTP_201_CREATED)
        return Response({
            'errors': serializer.errors,
            'message': 'Referral submission failed'
        }, status=status.HTTP_400_BAD_REQUEST)

class WithdrawalRequestView(generics.CreateAPIView):
    serializer_class = WithdrawalRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def perform_create(self, serializer):
        user = self.request.user
        min_withdrawal = 1000
        
        if user.balance < min_withdrawal:
            raise ValidationError(
                f"Minimum withdrawal amount is {min_withdrawal}. Your current balance is {user.balance}."
            )
        
        withdrawal = serializer.save(
            user=user,
            amount=user.balance,
            status='pending'
        )
        
        # Deduct from user's balance immediately
        user.balance = 0
        user.save()
        
        return withdrawal

# Admin Views
class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [TokenAuthentication]
    pagination_class = None  # Or use PageNumberPagination with custom settings

class AdminReferralListView(generics.ListAPIView):
    queryset = Referral.objects.all().select_related('referrer', 'referred').order_by('-created_at')
    serializer_class = ReferralSerializer
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [TokenAuthentication]

class AdminWithdrawalListView(generics.ListAPIView):
    queryset = WithdrawalRequest.objects.all().select_related('user').order_by('-created_at')
    serializer_class = WithdrawalRequestSerializer
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [TokenAuthentication]

class AdminProcessWithdrawalView(APIView):
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def post(self, request, pk):
        try:
            withdrawal = WithdrawalRequest.objects.get(pk=pk)
            
            if withdrawal.status == 'completed':
                return Response(
                    {'error': 'Withdrawal already processed'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            if withdrawal.status == 'approved':
                # Mark as completed
                withdrawal.status = 'completed'
                withdrawal.save()
                
                # In a real app, you would process the payment here
                # For example, call a payment gateway API
                
                return Response(
                    {'message': 'Withdrawal processed successfully'},
                    status=status.HTTP_200_OK
                )
                
            return Response(
                {'error': 'Withdrawal must be approved before processing'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        except WithdrawalRequest.DoesNotExist:
            return Response(
                {'error': 'Withdrawal not found'},
                status=status.HTTP_404_NOT_FOUND
            )