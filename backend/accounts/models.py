from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator, MinValueValidator, EmailValidator
import uuid
from decimal import Decimal
from django.utils import timezone

class User(AbstractUser):
    phone_regex = RegexValidator(
        regex=r'^[6-9]\d{9}$',
        message="Phone number must be 10 digits and start with 6-9"
    )
    
    # Personal Information
    email = models.EmailField(
        unique=True,
        validators=[EmailValidator()],
        error_messages={
            'unique': "A user with that email already exists.",
        }
    )
    phone = models.CharField(
        validators=[phone_regex], 
        max_length=10, 
        blank=True, 
        null=True,
        unique=True,
        error_messages={
            'unique': "A user with that phone number already exists.",
        }
    )
    
    # Verification Status
    email_verified = models.BooleanField(default=False)
    phone_verified = models.BooleanField(default=True)  # Not using phone OTP anymore
    
    # Referral System
    referral_code = models.CharField(max_length=10, unique=True, blank=True)
    referred_by = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='referred_users'
    )
    
    # Wallet
    wallet_balance = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    # Admin Controls
    created_by_admin = models.BooleanField(default=False)
    
    # Additional fields
    email_otp_attempts = models.IntegerField(default=0)
    email_otp_last_sent = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-date_joined']
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def save(self, *args, **kwargs):
        # Generate referral code if not exists
        if not self.referral_code:
            self.referral_code = self.generate_referral_code()
        
        # Admin users and admin-created users are auto-verified
        if self.is_staff or self.created_by_admin:
            self.email_verified = True
            self.phone_verified = True
            
        # Ensure username is set if not provided
        if not self.username and self.email:
            self.username = self.email
            
        super().save(*args, **kwargs)
    
    def generate_referral_code(self):
        """Generate a unique 8-character referral code"""
        while True:
            code = str(uuid.uuid4())[:8].upper()
            if not User.objects.filter(referral_code=code).exists():
                return code
    
    @property
    def full_name(self):
        """Get user's full name"""
        name_parts = []
        if self.first_name:
            name_parts.append(self.first_name)
        if self.last_name:
            name_parts.append(self.last_name)
        return ' '.join(name_parts) if name_parts else self.username
    
    def can_request_email_otp(self):
        """Check if user can request a new email OTP"""
        if not self.email_otp_last_sent:
            return True
        
        # Allow new OTP every 60 seconds
        time_since_last = timezone.now() - self.email_otp_last_sent
        return time_since_last.total_seconds() >= 60
    
    def increment_otp_attempts(self):
        """Increment OTP attempts counter"""
        self.email_otp_attempts += 1
        self.save(update_fields=['email_otp_attempts'])
    
    def reset_otp_attempts(self):
        """Reset OTP attempts counter"""
        self.email_otp_attempts = 0
        self.save(update_fields=['email_otp_attempts'])
    
    def __str__(self):
        return f"{self.username} ({self.email})"


class EmailOTP(models.Model):
    """Model for storing email verification OTPs"""
    email = models.EmailField(db_index=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_verified = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Email OTP"
        verbose_name_plural = "Email OTPs"
        indexes = [
            models.Index(fields=['email', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.email} - {self.otp} - {'Verified' if self.is_verified else 'Pending'}"
    
    def is_expired(self):
        """Check if OTP has expired"""
        return timezone.now() > self.expires_at
    
    def increment_attempts(self):
        """Increment verification attempts"""
        self.attempts += 1
        self.save(update_fields=['attempts'])
    
    def verify(self):
        """Mark OTP as verified"""
        self.is_verified = True
        self.save(update_fields=['is_verified'])


class Referral(models.Model):
    """Model for tracking referral commissions"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
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
    
    # Project and commission details
    project_value = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)],
        default=0
    )
    reward_percentage = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(0)],
        default=0
    )
    reward_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)],
        default=0
    )
    
    # Status and timestamps
    status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES, 
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['referrer', 'referred_user']
        verbose_name = 'Referral'
        verbose_name_plural = 'Referrals'
    
    def __str__(self):
        return f"{self.referrer.username} → {self.referred_user.username} (${self.reward_amount})"
    
    def save(self, *args, **kwargs):
        # Calculate reward on creation
        if not self.pk:
            self.calculate_reward()
        super().save(*args, **kwargs)
    
    def calculate_reward(self):
        """Calculate commission based on project value"""
        if self.project_value >= 200000:
            self.reward_percentage = Decimal('5.00')
        elif self.project_value >= 100000:
            self.reward_percentage = Decimal('3.00')
        else:
            self.reward_percentage = Decimal('1.00')
        
        self.reward_amount = (self.project_value * self.reward_percentage) / 100
    
    def mark_as_paid(self):
        """Mark referral as paid and update wallet"""
        if self.status == 'completed':
            self.status = 'paid'
            self.paid_at = timezone.now()
            self.referrer.wallet_balance += self.reward_amount
            self.referrer.save()
            self.save()
            return True
        return False


class WithdrawalRequest(models.Model):
    """Model for withdrawal requests"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('processed', 'Processed'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='withdrawals'
    )
    
    # Amount details
    amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(500)]
    )
    fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    net_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    # Bank details
    account_number = models.CharField(max_length=20)
    ifsc_code = models.CharField(max_length=20)
    account_holder_name = models.CharField(max_length=100)
    bank_name = models.CharField(max_length=100, blank=True)
    branch_name = models.CharField(max_length=100, blank=True)
    
    # Tax details
    pan_number = models.CharField(max_length=10)
    
    # Status and tracking
    status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES, 
        default='pending'
    )
    rejection_reason = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    # Admin notes
    admin_notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Withdrawal Request'
        verbose_name_plural = 'Withdrawal Requests'
    
    def __str__(self):
        return f"{self.user.username} - ₹{self.amount} - {self.status}"
    
    def save(self, *args, **kwargs):
        # Calculate net amount if not set
        if not self.net_amount and self.amount:
            self.net_amount = self.amount - self.fee
        super().save(*args, **kwargs)
    
    def can_approve(self):
        """Check if withdrawal can be approved"""
        return (
            self.status == 'pending' and 
            self.user.wallet_balance >= self.amount
        )
    
    def approve(self, admin_user):
        """Approve withdrawal request"""
        if self.can_approve():
            self.status = 'approved'
            self.user.wallet_balance -= self.amount
            self.user.save()
            self.save()
            return True
        return False
    
    def reject(self, reason=""):
        """Reject withdrawal request"""
        self.status = 'rejected'
        self.rejection_reason = reason
        self.save()
        return True
    
    def process(self):
        """Mark withdrawal as processed"""
        if self.status == 'approved':
            self.status = 'processed'
            self.processed_at = timezone.now()
            self.save()
            return True
        return False