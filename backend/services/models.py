from django.db import models
from accounts.models import User
from django.utils.translation import gettext_lazy as _

class ServiceRequest(models.Model):
    SERVICE_TYPES = [
        ('CONSULT', 'Consultation'),
        ('REPAIR', 'Repair'),
        ('ONSITE', 'On-Site Service'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='service_requests')
    service_type = models.CharField(max_length=10, choices=SERVICE_TYPES)
    description = models.TextField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_service_type_display()} Request by {self.user.email}"

class ConsultationBooking(models.Model):
    CONSULTATION_TYPES = [
        ('VIDEO', 'Video Consultation'),
        ('SHOWROOM', 'Showroom Visit'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='consultations')
    consultation_type = models.CharField(max_length=10, choices=CONSULTATION_TYPES)
    scheduled_at = models.DateTimeField()
    duration = models.PositiveIntegerField(help_text="Duration in minutes", default=30)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['scheduled_at']
    
    def __str__(self):
        return f"{self.get_consultation_type_display()} for {self.user.email} at {self.scheduled_at}"

class RepairRequest(models.Model):
    URGENCY_CHOICES = [
        ('LOW', 'Low (Within 2 weeks)'),
        ('MEDIUM', 'Medium (Within 1 week)'),
        ('HIGH', 'High (Within 2 days)'),
        ('EMERGENCY', 'Emergency (Within 24 hours)'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ASSIGNED', 'Assigned to Technician'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='repair_requests')
    item_name = models.CharField(max_length=100)
    item_description = models.TextField()
    purchase_date = models.DateField(blank=True, null=True)
    warranty_available = models.BooleanField(default=False)
    issue_description = models.TextField()
    urgency = models.CharField(max_length=10, choices=URGENCY_CHOICES, default='MEDIUM')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-urgency', '-created_at']
    
    def __str__(self):
        return f"Repair request for {self.item_name} by {self.user.email}"

class OnSiteService(models.Model):
    SERVICE_TYPES = [
        ('MEASUREMENT', 'Site Measurement'),
        ('INSTALLATION', 'Installation'),
        ('MAINTENANCE', 'Maintenance'),
        ('OTHER', 'Other Service'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('SCHEDULED', 'Scheduled'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='onsite_services')
    service_type = models.CharField(max_length=15, choices=SERVICE_TYPES)
    preferred_date = models.DateField()
    preferred_time = models.TimeField()
    address = models.TextField()
    contact_person = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=15)
    special_instructions = models.TextField(blank=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['preferred_date', 'preferred_time']
    
    def __str__(self):
        return f"{self.get_service_type_display()} at {self.address} for {self.user.email}"