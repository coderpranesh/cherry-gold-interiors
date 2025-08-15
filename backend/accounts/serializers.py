#backend/accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import User, Referral, WithdrawalRequest
import re


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'first_name', 'last_name']
        read_only_fields = ['id']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    referral_code = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'phone', 'password', 'confirm_password', 'referral_code')
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
            'phone': {'required': True},
        }

    def validate_email(self, value):
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Enter a valid email address.")
        return value

    def validate_phone(self, value):
        if not re.match(r'^[0-9]{10}$', value):
            raise serializers.ValidationError("Phone number must be 10 digits.")
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        referral_code = validated_data.pop('referral_code', None)
        
        user = User.objects.create_user(**validated_data)
        user.generate_otp()
        
        if referral_code:
            try:
                referrer = User.objects.get(referral_code=referral_code)
                user.referred_by = referrer
                user.save()
            except User.DoesNotExist:
                pass
        
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            try:
                user = User.objects.get(email=email)
                user = authenticate(
                    username=user.username,
                    password=password
                )
                
                if not user:
                    raise serializers.ValidationError("Invalid credentials")
                    
                if not user.is_verified and not (user.is_staff or user.is_superuser):
                    raise serializers.ValidationError("Account not verified")
                
                data['user'] = user
                return data
                
            except User.DoesNotExist:
                raise serializers.ValidationError("User with this email does not exist")
        else:
            raise serializers.ValidationError("Must include 'email' and 'password'")
        
        
class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.CharField()
    otp = serializers.CharField()

    def validate(self, data):
        try:
            user = User.objects.get(email=data['email'])
            if not user.verify_otp(data['otp']):
                raise serializers.ValidationError("Invalid or expired OTP.")
            return user
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone', 'referral_code', 'balance', 'pending_balance')

class ReferralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Referral
        fields = '__all__'
        read_only_fields = ('referrer', 'is_confirmed', 'is_completed', 'amount_earned')

class WithdrawalRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = WithdrawalRequest
        fields = '__all__'
        read_only_fields = ('user', 'status', 'amount')

class ReferralDataSerializer(serializers.Serializer):
    referral_code = serializers.CharField()
    balance = serializers.DecimalField(max_digits=10, decimal_places=2)
    pending_balance = serializers.DecimalField(max_digits=10, decimal_places=2)
    min_withdrawal = serializers.DecimalField(max_digits=10, decimal_places=2)
    referral_amount = serializers.DecimalField(max_digits=10, decimal_places=2)