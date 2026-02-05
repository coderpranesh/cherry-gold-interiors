from rest_framework import serializers
from django.contrib.auth import authenticate
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.db import transaction, IntegrityError
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from django.db.models import Sum
from .models import User, Referral, WithdrawalRequest, EmailOTP


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data"""
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    referral_count = serializers.SerializerMethodField()
    total_earnings = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'referral_code', 'wallet_balance', 'email_verified',
            'referral_count', 'total_earnings', 'date_joined'
        ]
        read_only_fields = ['id', 'referral_code', 'wallet_balance', 'date_joined']
    
    def get_referral_count(self, obj):
        """Get count of successful referrals"""
        return obj.referrals_made.filter(status='paid').count()
    
    def get_total_earnings(self, obj):
        """Get total referral earnings"""
        total = obj.referrals_made.filter(status='paid').aggregate(
            total=Sum('reward_amount')
        )['total']
        return total or 0


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    referral_code_input = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        allow_null=True,
        max_length=10
    )
    terms_accepted = serializers.BooleanField(
        required=True,
        error_messages={'required': 'You must accept the terms and conditions.'}
    )
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name', 'phone',
            'password', 'confirm_password', 'referral_code_input',
            'terms_accepted'
        ]
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'phone': {'required': True},
        }
    
    def validate(self, data):
        """Validate registration data"""
        # Password confirmation
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': "Password fields didn't match."
            })
        
        # Email validation
        try:
            validate_email(data['email'])
        except ValidationError:
            raise serializers.ValidationError({
                'email': "Enter a valid email address."
            })
        
        # Phone validation
        phone = data.get('phone')
        if phone:
            if not phone.isdigit() or len(phone) != 10 or not phone.startswith(('6','7','8','9')):
                raise serializers.ValidationError({
                    'phone': "Enter a valid 10-digit Indian phone number starting with 6-9."
                })
        
        # Terms acceptance
        if not data.get('terms_accepted'):
            raise serializers.ValidationError({
                'terms_accepted': "You must accept the terms and conditions."
            })
        
        # Check for existing users
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({
                'username': "A user with that username already exists."
            })
        
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({
                'email': "A user with that email already exists."
            })
        
        if phone and User.objects.filter(phone=phone).exists():
            raise serializers.ValidationError({
                'phone': "A user with that phone number already exists."
            })
        
        # Validate referral code
        referral_code_input = data.get('referral_code_input')
        if referral_code_input:
            if not User.objects.filter(referral_code=referral_code_input).exists():
                raise serializers.ValidationError({
                    'referral_code_input': "Invalid referral code."
                })
        
        return data
    
    @transaction.atomic
    def create(self, validated_data):
        """Create new user with referral tracking"""
        # Extract extra fields
        referral_code_input = validated_data.pop('referral_code_input', None)
        validated_data.pop('confirm_password')
        validated_data.pop('terms_accepted')
        
        # Check if admin is creating the user
        request = self.context.get('request')
        is_admin_creation = request and request.user.is_staff
        
        # Create user
        user = User.objects.create_user(
            **validated_data,
            created_by_admin=is_admin_creation,
            email_verified=is_admin_creation
        )
        
        # Handle referral if code provided
        if referral_code_input:
            try:
                referrer = User.objects.get(referral_code=referral_code_input)
                user.referred_by = referrer
                user.save()
                
                # Create pending referral record
                Referral.objects.create(
                    referrer=referrer,
                    referred_user=user,
                    project_value=0,  # Will be updated when project is created
                    status='pending'
                )
            except User.DoesNotExist:
                # Invalid referral code - ignore silently
                pass
        
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    username = serializers.CharField(required=True)
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, data):
        """Validate login credentials"""
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            raise serializers.ValidationError(
                "Both username and password are required."
            )
        
        # Try to authenticate
        user = authenticate(username=username, password=password)
        
        if not user:
            raise serializers.ValidationError(
                "Invalid username or password."
            )
        
        # Check if user is active
        if not user.is_active:
            raise serializers.ValidationError(
                "This account has been deactivated."
            )
        
        # Check email verification for regular users
        if not (user.is_staff or user.created_by_admin) and not user.email_verified:
            raise serializers.ValidationError({
                'email_verification': "Email not verified.",
                'email': user.email,
                'resend_endpoint': '/api/auth/resend-email-otp/'
            })
        
        data['user'] = user
        return data


class EmailOTPSerializer(serializers.ModelSerializer):
    """Serializer for email OTP verification"""
    class Meta:
        model = EmailOTP
        fields = ['email', 'otp']
        extra_kwargs = {
            'email': {'required': True},
            'otp': {'required': True, 'min_length': 6, 'max_length': 6}
        }
    
    def validate(self, data):
        """Validate OTP data"""
        email = data.get('email')
        otp = data.get('otp')
        
        # Check if user exists
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'email': "No user found with this email address."
            })
        
        # Check if email is already verified
        if user.email_verified:
            raise serializers.ValidationError({
                'email': "This email is already verified."
            })
        
        # Check for recent OTP
        try:
            otp_obj = EmailOTP.objects.filter(
                email=email,
                created_at__gte=timezone.now() - timedelta(minutes=10)
            ).latest('created_at')
        except EmailOTP.DoesNotExist:
            raise serializers.ValidationError({
                'otp': "OTP expired or not found. Please request a new one."
            })
        
        # Check if OTP is already verified
        if otp_obj.is_verified:
            raise serializers.ValidationError({
                'otp': "This OTP has already been used."
            })
        
        # Check if OTP is expired
        if otp_obj.is_expired():
            raise serializers.ValidationError({
                'otp': "OTP has expired. Please request a new one."
            })
        
        # Check OTP attempts
        if otp_obj.attempts >= 5:
            raise serializers.ValidationError({
                'otp': "Too many attempts. Please request a new OTP."
            })
        
        # Increment attempts
        otp_obj.increment_attempts()
        
        # Verify OTP
        if otp_obj.otp != otp:
            raise serializers.ValidationError({
                'otp': "Invalid OTP. Please try again."
            })
        
        data['otp_obj'] = otp_obj
        data['user'] = user
        return data


class ResendOTPSerializer(serializers.Serializer):
    """Serializer for resending OTP"""
    email = serializers.EmailField(required=True)
    
    def validate(self, data):
        """Validate email for OTP resend"""
        email = data.get('email')
        
        # Check if user exists
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'email': "No user found with this email address."
            })
        
        # Check if already verified
        if user.email_verified:
            raise serializers.ValidationError({
                'email': "This email is already verified."
            })
        
        # Check rate limiting
        if not user.can_request_email_otp():
            raise serializers.ValidationError({
                'email': "Please wait 60 seconds before requesting a new OTP."
            })
        
        data['user'] = user
        return data


class ReferralSerializer(serializers.ModelSerializer):
    """Serializer for referral data"""
    referred_user = UserSerializer(read_only=True)
    referrer_name = serializers.CharField(source='referrer.get_full_name', read_only=True)
    
    class Meta:
        model = Referral
        fields = [
            'id', 'referred_user', 'referrer_name', 'project_value',
            'reward_percentage', 'reward_amount', 'status',
            'created_at', 'updated_at', 'paid_at'
        ]
        read_only_fields = fields


class ReferralDashboardSerializer(serializers.Serializer):
    """Serializer for referral dashboard"""
    referral_code = serializers.CharField(source='user.referral_code')
    total_referrals = serializers.IntegerField()
    pending_referrals = serializers.IntegerField()
    completed_referrals = serializers.IntegerField()
    paid_referrals = serializers.IntegerField()
    total_earnings = serializers.DecimalField(max_digits=10, decimal_places=2)
    pending_earnings = serializers.DecimalField(max_digits=10, decimal_places=2)
    available_balance = serializers.DecimalField(max_digits=10, decimal_places=2)
    referrals = ReferralSerializer(many=True)


class WithdrawalRequestSerializer(serializers.ModelSerializer):
    """Serializer for withdrawal requests"""
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = WithdrawalRequest
        fields = [
            'id', 'user', 'amount', 'fee', 'net_amount',
            'account_number', 'ifsc_code', 'account_holder_name',
            'bank_name', 'branch_name', 'pan_number',
            'status', 'status_display', 'rejection_reason',
            'created_at', 'processed_at'
        ]
        read_only_fields = [
            'id', 'user', 'fee', 'net_amount', 'status',
            'rejection_reason', 'created_at', 'processed_at'
        ]
        extra_kwargs = {
            'amount': {'min_value': 500},
            'pan_number': {'min_length': 10, 'max_length': 10},
        }
    
    def validate(self, data):
        """Validate withdrawal request"""
        user = self.context['request'].user
        
        # Check wallet balance
        if user.wallet_balance < data['amount']:
            raise serializers.ValidationError({
                'amount': f"Insufficient balance. Available: ₹{user.wallet_balance}"
            })
        
        # Check if user has pending withdrawal
        pending_withdrawals = WithdrawalRequest.objects.filter(
            user=user,
            status__in=['pending', 'approved']
        ).exists()
        
        if pending_withdrawals:
            raise serializers.ValidationError({
                'non_field_errors': "You have a pending withdrawal request."
            })
        
        # Validate PAN number format
        pan_number = data.get('pan_number', '').upper()
        if not pan_number.isalnum() or len(pan_number) != 10:
            raise serializers.ValidationError({
                'pan_number': "Invalid PAN number format."
            })
        data['pan_number'] = pan_number
        
        return data
    
    def create(self, validated_data):
        """Create withdrawal request"""
        user = validated_data['user']
        amount = validated_data['amount']
        
        # Calculate fee (example: 2% or ₹50, whichever is higher)
        fee = max(amount * Decimal('0.02'), Decimal('50'))
        net_amount = amount - fee
        
        withdrawal = WithdrawalRequest.objects.create(
            **validated_data,
            fee=fee,
            net_amount=net_amount
        )
        
        return withdrawal


class BankDetailSerializer(serializers.Serializer):
    """Serializer for bank details validation"""
    account_number = serializers.CharField(max_length=20, required=True)
    ifsc_code = serializers.CharField(max_length=20, required=True)
    account_holder_name = serializers.CharField(max_length=100, required=True)


class ReferralCodeValidationSerializer(serializers.Serializer):
    """Serializer for referral code validation"""
    code = serializers.CharField(max_length=10, required=True)
    
    def validate(self, data):
        """Validate referral code"""
        code = data.get('code')
        
        try:
            user = User.objects.get(referral_code=code)
            if user == self.context['request'].user:
                raise serializers.ValidationError({
                    'code': "You cannot use your own referral code."
                })
            data['referrer'] = user
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'code': "Invalid referral code."
            })
        
        return data