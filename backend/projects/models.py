# backend/projects/models.py
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from services.models import ServiceRequest
from accounts.models import User
import os

class Project(models.Model):
    PACKAGE_CHOICES = [
        ('STD', 'Standard'),
        ('PRE', 'Premium'),
        ('LUX', 'Luxury'),
    ]
    
    STATUS_CHOICES = [
        ('CONSULT', 'Consultation Booked'),
        ('DESIGN', 'Design Phase'),
        ('APPROVAL', 'Approval Phase'),
        ('MANUFACTURE', 'Manufacturing'),
        ('INSTALL', 'Installation'),
        ('COMPLETE', 'Completed'),
        ('HOLD', 'On Hold'),
    ]
    
    service_request = models.OneToOneField(
        ServiceRequest,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='project',
        help_text="The original service request that created this project"
    )
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    package = models.CharField(max_length=3, choices=PACKAGE_CHOICES)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='CONSULT')
    start_date = models.DateField()
    estimated_completion = models.DateField()
    actual_completion = models.DateField(null=True, blank=True)
    area = models.FloatField(help_text="Area in square feet", validators=[MinValueValidator(0)])
    budget = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    referral = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='referred_projects')
    work_code = models.CharField(max_length=10, unique=True)
    special_instructions = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    progress = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    current_stage = models.CharField(max_length=100, blank=True)
    
    class Meta:
        ordering = ['-start_date']
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'
    
    def __str__(self):
        return f"Project {self.work_code} - {self.get_package_display()}"
    
    def clean(self):
        """Validate the service request and number"""
        if self.service_request:
            if not ServiceRequest.objects.filter(pk=self.service_request.pk).exists():
                raise ValidationError("Invalid service request - not found in database")
            if not self.service_request.service_number:
                raise ValidationError("Linked service request has no service number")
    
    def save(self, *args, **kwargs):
        if not self.work_code:
            last_project = Project.objects.order_by('-id').first()
            last_id = last_project.id if last_project else 0
            self.work_code = f"CGI-{last_id + 1:04d}"
        
        if not self.current_stage:
            self.current_stage = self.get_status_display()
        
        super().save(*args, **kwargs)
    
    @property
    def service_number(self):
        """Get service number from linked ServiceRequest or fallback to work_code"""
        return self.service_request.service_number if self.service_request else self.work_code
    
    @property
    def customer_name(self):
        """Get client's full name for frontend"""
        return self.client.get_full_name()
    
    @property
    def project_type(self):
        """Get package display name for frontend"""
        return self.get_package_display()

class ProjectStage(models.Model):
    STAGE_STATUS = [
        ('completed', 'Completed'),
        ('current', 'Current'),
        ('upcoming', 'Upcoming'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='stages')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STAGE_STATUS, default='upcoming')
    start_date = models.DateField()
    end_date = models.DateField()
    completed = models.BooleanField(default=False)
    completed_date = models.DateField(null=True, blank=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.name} for {self.project.work_code}"
    
    def save(self, *args, **kwargs):
        # Update status based on completion
        if self.completed:
            self.status = 'completed'
        elif not self.completed and self.status == 'completed':
            self.status = 'current'
        
        super().save(*args, **kwargs)
        
        # Update project's current stage if this is the current stage
        if self.status == 'current':
            self.project.current_stage = self.name
            self.project.save()

class ProjectUpdate(models.Model):
    UPDATE_TYPES = [
        ('PROGRESS', 'Progress Update'),
        ('ISSUE', 'Issue'),
        ('CHANGE', 'Change Request'),
        ('PAYMENT', 'Payment Update'),
        ('OTHER', 'Other'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='updates')
    update_type = models.CharField(max_length=10, choices=UPDATE_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    requires_action = models.BooleanField(default=False)
    action_completed = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_update_type_display()} - {self.title}"
    
    @property
    def date(self):
        """Formatted date for frontend"""
        return self.created_at.strftime('%Y-%m-%d')

class ProjectImage(models.Model):
    update = models.ForeignKey(ProjectUpdate, on_delete=models.CASCADE, related_name='images', null=True, blank=True)
    image = models.ImageField(upload_to='project_updates/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    caption = models.CharField(max_length=200, blank=True)
    
    def __str__(self):
        return f"Image for {self.update.title if self.update else 'No Update'}"
    
    @property
    def url(self):
        """Full URL for the image"""
        if self.image and hasattr(self.image, 'url'):
            return self.image.url
        return None

class ProjectDocument(models.Model):
    DOCUMENT_TYPES = [
        ('DESIGN', 'Design Document'),
        ('QUOTE', 'Quotation'),
        ('CONTRACT', 'Contract'),
        ('INVOICE', 'Invoice'),
        ('PHOTO', 'Photograph'),
        ('OTHER', 'Other'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=10, choices=DOCUMENT_TYPES)
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='projects/documents/')
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.get_document_type_display()} - {self.title}"

class ProjectTeam(models.Model):
    ROLE_CHOICES = [
        ('DESIGNER', 'Designer'),
        ('PM', 'Project Manager'),
        ('CARPENTER', 'Carpenter'),
        ('ELECTRICIAN', 'Electrician'),
        ('PAINTER', 'Painter'),
        ('SUPERVISOR', 'Site Supervisor'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='team_members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='project_assignments')
    role = models.CharField(max_length=15, choices=ROLE_CHOICES)
    assigned_date = models.DateField(auto_now_add=True)
    is_primary = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('project', 'user')
        ordering = ['-is_primary', 'role']
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.get_role_display()} for {self.project.work_code}"

class BudgetEstimate(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='budget_items')
    item_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    unit = models.CharField(max_length=20, default='sq.ft.')
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    total_price = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    
    class Meta:
        ordering = ['item_name']
    
    def __str__(self):
        return f"{self.item_name} - {self.quantity} {self.unit} @ {self.unit_price}"
    
    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)