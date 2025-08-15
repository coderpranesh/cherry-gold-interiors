#backend/accounts/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
import uuid
from django.utils import timezone

class User(AbstractUser):
    phone_regex = RegexValidator(
        regex=r'^[0-9]{10}$',
        message="Phone number must be 10 digits without country code"
    )
    
    phone = models.CharField(
        validators=[phone_regex],
        max_length=10,
        unique=True
    )
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, null=True, blank=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)
    referral_code = models.CharField(max_length=10, unique=True, blank=True)
    referred_by = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='referrals'
    )
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    pending_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    def save(self, *args, **kwargs):
        if not self.referral_code:
            self.referral_code = str(uuid.uuid4())[:8].upper()
        super().save(*args, **kwargs)
    
    def generate_otp(self):
        self.otp = str(uuid.uuid4())[:6]
        self.otp_created_at = timezone.now()
        self.save()
        return self.otp
    
    def verify_otp(self, otp):
        if self.otp == otp and (timezone.now() - self.otp_created_at).seconds < 300:
            self.is_verified = True
            self.otp = None
            self.otp_created_at = None
            self.save()
            return True
        return False

class Referral(models.Model):
    referrer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='referral_activities'
    )
    referee_name = models.CharField(max_length=100)
    referee_email = models.EmailField()
    referee_phone = models.CharField(max_length=10)
    transaction_id = models.CharField(max_length=50)
    additional_info = models.TextField(blank=True)
    is_confirmed = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    amount_earned = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def confirm_referral(self):
        self.is_confirmed = True
        self.save()
        # Add pending balance to referrer
        self.referrer.pending_balance += self.amount_earned
        self.referrer.save()

    def complete_referral(self):
        self.is_completed = True
        self.save()
        # Move from pending to actual balance
        self.referrer.pending_balance -= self.amount_earned
        self.referrer.balance += self.amount_earned
        self.referrer.save()

class WithdrawalRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    account_holder_name = models.CharField(max_length=100)
    account_number = models.CharField(max_length=20)
    ifsc_code = models.CharField(max_length=20)
    pan_number = models.CharField(max_length=10)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('approved', 'Approved'),
            ('rejected', 'Rejected'),
            ('processed', 'Processed')
        ],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def approve(self):
        if self.status == 'pending' and self.user.balance >= self.amount:
            self.status = 'approved'
            self.save()
            return True
        return False

    def reject(self):
        if self.status == 'pending':
            self.status = 'rejected'
            self.save()
            return True
        return False

    def process(self):
        if self.status == 'approved':
            self.user.balance -= self.amount
            self.user.save()
            self.status = 'processed'
            self.save()
            return True
        return False