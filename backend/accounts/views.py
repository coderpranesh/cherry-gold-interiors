from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth import authenticate
from django.db import transaction, models
from django.db.models import Count, Sum
from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from datetime import timedelta
import random
import logging

from .models import User, Referral, WithdrawalRequest, EmailOTP
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    EmailOTPSerializer, ResendOTPSerializer,
    ReferralDashboardSerializer, WithdrawalRequestSerializer,
    ReferralCodeValidationSerializer, BankDetailSerializer
)

# Setup logger
logger = logging.getLogger(__name__)


# ==================== AUTHENTICATION VIEWS ====================

class RegisterView(generics.CreateAPIView):
    """
    Register a new user
    """
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
    def get_serializer_context(self):
        """Add request to serializer context"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Create new user and send email OTP"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()
        
        # Skip OTP for admin-created users
        if not (request.user.is_staff or user.created_by_admin):
            # Generate and send email OTP
            otp_success = self.send_email_otp(user.email, user.username)
            
            if not otp_success and not settings.DEBUG:
                # If email sending fails in production, rollback
                user.delete()
                return Response(
                    {"error": "Failed to send verification email. Please try again."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        # Generate tokens if auto-login is enabled
        refresh = None
        access = None
        if getattr(settings, 'AUTO_LOGIN_AFTER_REGISTER', False) and user.email_verified:
            refresh = RefreshToken.for_user(user)
            access = str(refresh.access_token)
        
        response_data = {
            "message": "Registration successful! Please check your email for verification OTP.",
            "user": UserSerializer(user).data,
            "verification_required": not (request.user.is_staff or user.created_by_admin),
            "auto_login": getattr(settings, 'AUTO_LOGIN_AFTER_REGISTER', False) and user.email_verified,
        }
        
        if access:
            response_data.update({
                "access": access,
                "refresh": str(refresh)
            })
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    
    def send_email_otp(self, email, username=None):
        EmailOTP.objects.filter(email=email).delete()

        otp = str(random.randint(100000, 999999))
        expires_at = timezone.now() + timedelta(minutes=10)

        EmailOTP.objects.create(
            email=email,
            otp=otp,
            expires_at=expires_at
        )

        subject = "Verify Your Email | Cherry Gold Interiors"

        context = {
            "otp": otp,
            "username": username or "Guest",
            "site_name": "Cherry Gold Interiors",
            "year": timezone.now().year,
        }

        # Render HTML
        html_content = render_to_string("emails/email_otp.html", context)

        # Plain text fallback
        text_content = strip_tags(html_content)

        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = [email]

        try:
            email_message = EmailMultiAlternatives(
                subject,
                text_content,
                from_email,
                to_email
            )

            email_message.attach_alternative(html_content, "text/html")
            email_message.send()

            logger.info(f"OTP email sent to {email}")
            return True

        except Exception as e:
            logger.error(f"Failed to send OTP email to {email}: {str(e)}")

            if settings.DEBUG:
                print(f"DEBUG OTP for {email}: {otp}")
                return True

            return False


class LoginView(APIView):
    """
    Authenticate user and return JWT tokens
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # Update last login
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            
            return Response({
                "message": "Login successful",
                "user": UserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailOTPView(APIView):
    """
    Verify email using OTP
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = EmailOTPSerializer(data=request.data)
        
        if serializer.is_valid():
            otp_obj = serializer.validated_data['otp_obj']
            user = serializer.validated_data['user']
            
            # Mark OTP as verified
            otp_obj.verify()
            
            # Mark user's email as verified
            user.email_verified = True
            user.reset_otp_attempts()
            user.save(update_fields=['email_verified'])
            
            # Generate tokens for auto-login
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "message": "Email verified successfully!",
                "user": UserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResendEmailOTPView(APIView):
    """
    Resend email OTP
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Send new OTP
            register_view = RegisterView()
            otp_sent = register_view.send_email_otp(user.email, user.username)
            
            if otp_sent:
                return Response({
                    "message": "OTP has been resent to your email.",
                    "email": user.email
                })
            else:
                return Response(
                    {"error": "Failed to send OTP. Please try again later."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==================== REFERRAL VIEWS ====================

class ReferralDashboardView(APIView):
    """
    Get user's referral dashboard
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Get referrals
        referrals = Referral.objects.filter(referrer=user).select_related('referred_user')
        
        # Calculate statistics
        stats = referrals.aggregate(
            total=Count('id'),
            pending=Count('id', filter=models.Q(status='pending')),
            completed=Count('id', filter=models.Q(status='completed')),
            paid=Count('id', filter=models.Q(status='paid')),
            total_earnings=Sum('reward_amount', filter=models.Q(status='paid')),
            pending_earnings=Sum('reward_amount', filter=models.Q(status='completed'))
        )
        
        # Prepare dashboard data
        dashboard_data = {
            "user": user,
            "total_referrals": stats['total'] or 0,
            "pending_referrals": stats['pending'] or 0,
            "completed_referrals": stats['completed'] or 0,
            "paid_referrals": stats['paid'] or 0,
            "total_earnings": stats['total_earnings'] or 0,
            "pending_earnings": stats['pending_earnings'] or 0,
            "available_balance": user.wallet_balance,
            "referrals": referrals
        }
        
        serializer = ReferralDashboardSerializer(dashboard_data)
        return Response(serializer.data)


class ReferralCodeValidationView(APIView):
    """
    Validate a referral code
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        serializer = ReferralCodeValidationSerializer(
            data=request.query_params,
            context={'request': request}
        )
        
        if serializer.is_valid():
            referrer = serializer.validated_data['referrer']
            return Response({
                "valid": True,
                "referrer_name": referrer.get_full_name() or referrer.username,
                "referrer_code": referrer.referral_code
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==================== WITHDRAWAL VIEWS ====================

class WithdrawalRequestView(APIView):
    """
    Create and manage withdrawal requests
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get user's withdrawal history"""
        withdrawals = WithdrawalRequest.objects.filter(user=request.user)
        serializer = WithdrawalRequestSerializer(withdrawals, many=True)
        return Response(serializer.data)
    
    @transaction.atomic
    def post(self, request):
        """Create new withdrawal request"""
        serializer = WithdrawalRequestSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            withdrawal = serializer.save()
            
            # Notify admin (in production, send email/notification)
            if not settings.DEBUG:
                self.notify_admin(withdrawal)
            
            return Response({
                "message": "Withdrawal request submitted successfully.",
                "withdrawal": WithdrawalRequestSerializer(withdrawal).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def notify_admin(self, withdrawal):
        """Notify admin about new withdrawal request"""
        subject = f"New Withdrawal Request - ₹{withdrawal.amount}"
        
        message = f"""
        New withdrawal request received:
        
        User: {withdrawal.user.username} ({withdrawal.user.email})
        Amount: ₹{withdrawal.amount}
        Net Amount: ₹{withdrawal.net_amount}
        Fee: ₹{withdrawal.fee}
        
        Bank Details:
        Account Holder: {withdrawal.account_holder_name}
        Account Number: {withdrawal.account_number}
        IFSC Code: {withdrawal.ifsc_code}
        Bank: {withdrawal.bank_name}
        
        Requested at: {withdrawal.created_at}
        
        Please review and process the request.
        """
        
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.ADMIN_EMAIL],
                fail_silently=True,
            )
        except Exception as e:
            logger.error(f"Failed to send admin notification: {str(e)}")


class BankDetailValidationView(APIView):
    """
    Validate bank details (simplified validation)
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = BankDetailSerializer(data=request.data)
        
        if serializer.is_valid():
            # In production, you would integrate with a bank validation API
            # For now, we'll do basic validation
            
            data = serializer.validated_data
            
            # Basic validation rules
            ifsc = data['ifsc_code'].upper()
            
            # Check IFSC format (example: SBIN0001234)
            if len(ifsc) != 11 or not ifsc[:4].isalpha() or not ifsc[4:].isalnum():
                return Response({
                    "valid": False,
                    "message": "Invalid IFSC code format."
                })
            
            # Check account number (basic)
            account_number = data['account_number']
            if not account_number.isdigit() or len(account_number) < 9 or len(account_number) > 18:
                return Response({
                    "valid": False,
                    "message": "Invalid account number format."
                })
            
            return Response({
                "valid": True,
                "message": "Bank details appear valid.",
                "bank_details": {
                    "account_holder": data['account_holder_name'],
                    "account_number": f"****{account_number[-4:]}",
                    "ifsc_code": ifsc
                }
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==================== ADMIN VIEWS ====================

@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdminUser])
def admin_delete_user(request, user_id):
    """
    API endpoint for admin to delete users
    """
    try:
        # Prevent admin from deleting themselves
        if request.user.id == user_id:
            return Response(
                {"error": "You cannot delete your own account."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user_to_delete = User.objects.get(id=user_id)
        
        # Prevent deleting superusers
        if user_to_delete.is_superuser:
            return Response(
                {"error": "Cannot delete superusers."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Store user info for response
        user_info = {
            "id": user_to_delete.id,
            "username": user_to_delete.username,
            "email": user_to_delete.email,
            "deleted_at": timezone.now()
        }
        
        # Delete the user
        username = user_to_delete.username
        user_to_delete.delete()
        
        logger.warning(f"User {username} (ID: {user_id}) deleted by admin {request.user.username}")
        
        return Response({
            "message": "User deleted successfully.",
            "deleted_user": user_info
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response(
            {"error": "User not found."},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error deleting user {user_id}: {str(e)}")
        return Response(
            {"error": "An error occurred while deleting the user."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ==================== PROFILE VIEWS ====================

class ProfileView(APIView):
    """
    Get and update user profile
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get user profile"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def patch(self, request):
        """Update user profile"""
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Profile updated successfully.",
                "user": serializer.data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """
    Change user password
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')
        
        # Validate inputs
        if not all([old_password, new_password, confirm_password]):
            return Response(
                {"error": "All fields are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if new_password != confirm_password:
            return Response(
                {"error": "New passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check old password
        if not request.user.check_password(old_password):
            return Response(
                {"error": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new password
        request.user.set_password(new_password)
        request.user.save()
        
        logger.info(f"User {request.user.username} changed password")
        
        return Response({
            "message": "Password changed successfully."
        })


# ==================== HEALTH CHECK ====================

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Simple health check endpoint
    """
    return Response({
        "status": "healthy",
        "service": "accounts-api",
        "timestamp": timezone.now()
    })