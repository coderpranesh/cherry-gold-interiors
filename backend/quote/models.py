from django.db import models
from django.utils import timezone
from datetime import timedelta

class CostEstimation(models.Model):
    PROJECT_TYPES = [
        ('kitchen', 'Modular Kitchen'),
        ('wall-paneling', 'Wall Paneling'),
        ('false-ceiling', 'False Ceiling'),
        ('interior-decoration', 'Interior Decoration'),
        ('wardrobe', 'Wardrobe'),
        ('complete-home', 'Complete Home'),
    ]
    
    # Project details
    project_type = models.CharField(max_length=50, choices=PROJECT_TYPES)
    kitchen_package = models.CharField(max_length=50, blank=True, null=True)
    wall_paneling_package = models.CharField(max_length=50, blank=True, null=True)
    false_ceiling_type = models.CharField(max_length=50, blank=True, null=True)
    interior_package = models.CharField(max_length=50, blank=True, null=True)
    wardrobe_package = models.CharField(max_length=50, blank=True, null=True)
    
    # Dimensions
    length = models.FloatField()
    width = models.FloatField()
    height = models.FloatField(blank=True, null=True)
    
    # Calculations
    area = models.FloatField()
    base_price = models.DecimalField(max_digits=12, decimal_places=2)
    features_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    gst = models.DecimalField(max_digits=12, decimal_places=2)
    final_cost = models.DecimalField(max_digits=12, decimal_places=2)
    include_gst = models.BooleanField(default=True)
    
    # Additional data
    additional_features = models.JSONField(default=list)
    package_description = models.TextField(blank=True, null=True)
    package_features = models.JSONField(default=list)
    
    # Metadata
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()
    
    # Contact information (if provided)
    contact_name = models.CharField(max_length=100, blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=15, blank=True, null=True)
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.get_project_type_display()} - ₹{self.final_cost} - {self.created_at.strftime('%Y-%m-%d')}"
    
    class Meta:
        ordering = ['-created_at']