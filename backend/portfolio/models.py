from django.db import models
from django.utils.text import slugify
from django.urls import reverse

class PortfolioItem(models.Model):
    CATEGORY_CHOICES = [
        ('KIT', 'Kitchen'),
        ('LIV', 'Living Room'),
        ('BED', 'Bedroom'),
        ('BATH', 'Bathroom'),
        ('OFF', 'Office'),
        ('DIN', 'Dining Room'),
        ('COM', 'Commercial'),
    ]
    
    title = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    category = models.CharField(max_length=4, choices=CATEGORY_CHOICES)
    description = models.TextField()
    main_image = models.ImageField(upload_to='portfolio/main_images/')
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Portfolio Items'
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('portfolio-detail', kwargs={'slug': self.slug})

class PortfolioImage(models.Model):
    portfolio_item = models.ForeignKey(PortfolioItem, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='portfolio/images/')
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"Image for {self.portfolio_item.title}"

class PortfolioVideo(models.Model):
    portfolio_item = models.ForeignKey(PortfolioItem, on_delete=models.CASCADE, related_name='videos')
    video_url = models.URLField()
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"Video for {self.portfolio_item.title}"

class CaseStudy(models.Model):
    portfolio_item = models.ForeignKey(PortfolioItem, on_delete=models.CASCADE, related_name='case_studies')
    title = models.CharField(max_length=200)
    content = models.TextField()
    before_image = models.ImageField(upload_to='portfolio/case_studies/before/', blank=True, null=True)
    after_image = models.ImageField(upload_to='portfolio/case_studies/after/', blank=True, null=True)
    challenges = models.TextField(blank=True)
    solutions = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Case Study: {self.title} for {self.portfolio_item.title}"