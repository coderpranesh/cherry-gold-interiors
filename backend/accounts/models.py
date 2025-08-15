from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator, MinValueValidator
import uuid
from decimal import Decimal

class User(AbstractUser):
    phone_regex = RegexValidator(
        regex=r'^[6-9]\d{9}$',
        message="Phone number must be 10 digits and start with 6-9"
    )
    
    phone = models.CharField(
        validators=[phone_regex], 
        max_length=10, 
        blank=True, 
        null=True,
        unique=True
    )
    email_verified = models.BooleanField(default=False)
    phone_verified = models.BooleanField(default=False)
    referral_code = models.CharField(max_length=10, unique=True, blank=True)
    referred_by = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='referred_users'
    )
    wallet_balance = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)]
    )
    created_by_admin = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if not self.referral_code:
            self.referral_code = self.generate_referral_code()
        
        # Admin users and admin-created users are always verified
        if self.is_staff or self.created_by_admin:
            self.email_verified = True
            self.phone_verified = True
            
        super().save(*args, **kwargs)
    
    def generate_referral_code(self):
        return str(uuid.uuid4())[:8].upper()
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

class Referral(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('paid', 'Paid'),
    ]
    
    referrer = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='referrals_made'
    )
    referred_user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='referrals_received'
    )
    project_value = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    reward_percentage = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    reward_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES, 
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.pk:  # Only on creation
            self.calculate_reward()
        super().save(*args, **kwargs)
    
    def calculate_reward(self):
        if self.project_value >= 200000:
            self.reward_percentage = Decimal('5.00')
        elif self.project_value >= 100000:
            self.reward_percentage = Decimal('3.00')
        else:
            self.reward_percentage = Decimal('1.00')
        
        self.reward_amount = (self.project_value * self.reward_percentage) / 100

class WithdrawalRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('processed', 'Processed'),
    ]
    
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='withdrawals'
    )
    amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(500)]
    )
    account_number = models.CharField(max_length=20)
    ifsc_code = models.CharField(max_length=20)
    account_holder_name = models.CharField(max_length=100)
    pan_number = models.CharField(max_length=10)
    status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES, 
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']

class OTPVerification(models.Model):
    phone = models.CharField(max_length=10)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.phone} - {self.otp}"