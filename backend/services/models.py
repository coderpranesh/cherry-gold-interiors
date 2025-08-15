#backend/services/models.py
from django.db import models
from django.core.validators import RegexValidator
from django.db import transaction, IntegrityError
from django.utils import timezone
import random
import logging
from django.db.models import Max
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)

class ServiceSequenceManager(models.Manager):
    def get_next_sequence(self, year_month):
        """
        Thread-safe method to get and increment the sequence number
        """
        try:
            with transaction.atomic():
                # Get or create the sequence record for this year_month
                sequence_obj, created = self.get_or_create(
                    year_month=year_month,
                    defaults={'last_sequence': 0}
                )
                
                # Increment and save
                sequence_obj.last_sequence += 1
                sequence_obj.save()
                
                return sequence_obj.last_sequence
                
        except Exception as e:
            logger.error(f"Error getting next sequence for {year_month}: {e}")
            return None

class ServiceSequence(models.Model):
    year_month = models.CharField(max_length=4, unique=True)  # Format: YYMM
    last_sequence = models.PositiveIntegerField(default=0)

    objects = ServiceSequenceManager()

    class Meta:
        verbose_name = 'Service Sequence'
        verbose_name_plural = 'Service Sequences'
        indexes = [
            models.Index(fields=['year_month']),
        ]

    def __str__(self):
        return f"{self.year_month}: {self.last_sequence}"

class ServiceRequest(models.Model):
    SERVICE_TYPES = (
        ('repair', 'Repair Request'),
        ('video', 'Video Consultancy'),
        ('onsite', 'On-site Free Consultancy'),
    )

    PROJECT_TYPES = (
        ('', 'Not specified'),
        ('kitchen', 'Modular Kitchen'),
        ('wardrobe', 'Wardrobe'),
        ('living-room', 'Living Room'),
        ('bedroom', 'Bedroom'),
        ('complete-home', 'Complete Home'),
        ('office', 'Office Interior'),
    )

    TIME_SLOTS = (
        ('', 'Not specified'),
        ('10:00', '10:00 AM'),
        ('11:00', '11:00 AM'),
        ('12:00', '12:00 PM'),
        ('14:00', '2:00 PM'),
        ('15:00', '3:00 PM'),
        ('16:00', '4:00 PM'),
        ('morning', 'Morning (9 AM - 12 PM)'),
        ('afternoon', 'Afternoon (12 PM - 4 PM)'),
        ('evening', 'Evening (4 PM - 7 PM)'),
    )

    STATUS_CHOICES = (
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('on_hold', 'On Hold'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    service_type = models.CharField(max_length=20, choices=SERVICE_TYPES)
    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, validators=[
        RegexValidator(
            regex=r'^\+?[0-9]{10,15}$',
            message="Phone number must be 10-15 digits and may include country code"
        )
    ])
    email = models.EmailField(blank=True, null=True)
    service_number = models.CharField(max_length=50, unique=True, blank=True)
    issue_description = models.TextField(blank=True, null=True)
    preferred_date = models.DateField(blank=True, null=True)
    preferred_time = models.CharField(max_length=50, choices=TIME_SLOTS, blank=True, null=True)
    complete_address = models.TextField(blank=True, null=True)
    project_type = models.CharField(max_length=50, choices=PROJECT_TYPES, blank=True, null=True)
    project_details = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='new'
    )
    status_changed = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.service_number} - {self.get_service_type_display()} ({self.full_name})"

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Service Request'
        verbose_name_plural = 'Service Requests'
        indexes = [
            models.Index(fields=['service_number']),
            models.Index(fields=['service_type']),
            models.Index(fields=['status']),
        ]

    def clean(self):
        """Validate the model before saving"""
        errors = {}
        
        # Service-specific validation
        if self.service_type == 'video' and not self.email:
            errors['email'] = "Email is required for video consultancy"
        
        if self.service_type == 'onsite' and not self.complete_address:
            errors['complete_address'] = "Address is required for on-site consultancy"
        
        if errors:
            raise ValidationError(errors)
        
        if not self.service_number:
            self.service_number = self.generate_service_number()

    def save(self, *args, **kwargs):
        """Save the model with automatic service number generation"""
        if not self.service_number:
            max_attempts = 5
            for attempt in range(max_attempts):
                try:
                    self.service_number = self.generate_service_number()
                    super().save(*args, **kwargs)
                    return
                except IntegrityError as e:
                    if attempt == max_attempts - 1:
                        raise ValidationError("Failed to generate unique service number after multiple attempts")
                    continue
        else:
            super().save(*args, **kwargs)

    def generate_service_number(self):
        """Generate a unique service number in CGyymmXXXX format"""
        now = timezone.now()
        year_month = now.strftime('%y%m')
        prefix = f"CG{year_month}"

        # Get next sequence number (shared across all service types)
        sequence = ServiceSequence.objects.get_next_sequence(year_month)

        if sequence is None:
            # Fallback with timestamp + random to ensure uniqueness
            logger.warning("Sequence generation failed, using fallback")
            timestamp = int(now.timestamp() % 10000)
            random_num = random.randint(0, 9999)
            return f"{prefix}F{timestamp:04d}{random_num:04d}"

        return f"{prefix}{sequence:04d}"

    def set_status(self, new_status, commit=True):
        """Update the status of the service request"""
        if new_status != self.status:
            self.status = new_status
            self.status_changed = timezone.now()
            if commit:
                self.save()

    @classmethod
    def get_active_requests(cls):
        """Get all non-completed requests"""
        return cls.objects.exclude(status__in=['completed', 'cancelled']).select_related().only(
            'service_number', 
            'service_type',
            'full_name',
            'created_at',
            'status'
        )