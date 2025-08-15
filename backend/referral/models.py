from django.db import models
from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string

User = get_user_model()

def generate_referral_code():
    return f"CG_{get_random_string(8).upper()}"

class Referral(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('paid', 'Paid'),
    ]
    
    referrer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='referrals_made')
    referee_name = models.CharField(max_length=100)
    referee_email = models.EmailField()
    referee_phone = models.CharField(max_length=15)
    project_value = models.DecimalField(max_digits=10, decimal_places=2)
    project_type = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reward_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.pk and self.project_value >= 100000:  # Only for new referrals
            if self.project_value >= 200000:
                self.reward_amount = self.project_value * 0.05  # 5% for premium
            else:
                self.reward_amount = self.project_value * 0.03  # 3% for standard
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.referrer.email} → {self.referee_email} ({self.status})"

class ReferralReward(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='referral_reward')
    total_earned = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    pending_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    referral_code = models.CharField(max_length=20, unique=True, default=generate_referral_code)
    
    def __str__(self):
        return f"{self.user.email} - ₹{self.pending_amount} pending"

class WithdrawalRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('processed', 'Processed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='withdrawals')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    bank_account_number = models.CharField(max_length=50)
    bank_name = models.CharField(max_length=100)
    ifsc_code = models.CharField(max_length=20)
    pan_number = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} - ₹{self.amount} ({self.status})"

    class Meta:
        ordering = ['-created_at']