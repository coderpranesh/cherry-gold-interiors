from rest_framework import serializers
from django.contrib.auth import authenticate
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import User, Referral, WithdrawalRequest, OTPVerification
from django.contrib.auth.password_validation import validate_password
from django.core.validators import RegexValidator

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'phone', 'referral_code', 'wallet_balance'
        ]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    confirm_password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name', 'phone',
            'password', 'confirm_password', 'referral_code'
        ]
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'phone': {'required': True},
        }
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        try:
            validate_email(data['email'])
        except ValidationError:
            raise serializers.ValidationError({"email": "Enter a valid email address."})
            
        if not data['phone'].isdigit() or len(data['phone']) != 10 or not data['phone'].startswith(('6','7','8','9')):
            raise serializers.ValidationError({"phone": "Enter a valid 10-digit Indian phone number starting with 6-9."})
            
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        referral_code = validated_data.pop('referral_code', None)
        
        # Check if the request is made by admin
        request = self.context.get('request')
        if request and request.user.is_staff:
            validated_data['created_by_admin'] = True
        
        user = User.objects.create_user(**validated_data)
        
        if referral_code:
            try:
                referrer = User.objects.get(referral_code=referral_code)
                user.referred_by = referrer
                user.save()
                
                # Create referral record
                Referral.objects.create(
                    referrer=referrer,
                    referred_user=user,
                    project_value=0,
                    reward_percentage=0,
                    reward_amount=0,
                    status='pending'
                )
            except User.DoesNotExist:
                pass
                
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        if not user.email_verified:
            raise serializers.ValidationError("Email not verified")
        return user

class ReferralSerializer(serializers.ModelSerializer):
    referred_user = UserSerializer()
    
    class Meta:
        model = Referral
        fields = [
            'id', 'referred_user', 'project_value', 'reward_percentage',
            'reward_amount', 'status', 'created_at'
        ]

class ReferralDashboardSerializer(serializers.Serializer):
    referral_code = serializers.CharField()
    total_earnings = serializers.DecimalField(max_digits=10, decimal_places=2)
    available_balance = serializers.DecimalField(max_digits=10, decimal_places=2)
    referrals = ReferralSerializer(many=True)

class WithdrawalRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = WithdrawalRequest
        fields = [
            'amount', 'account_number', 'ifsc_code', 
            'account_holder_name', 'pan_number'
        ]

class OTPVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTPVerification
        fields = ['phone', 'otp']