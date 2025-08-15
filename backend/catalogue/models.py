#backend/catalogue/models.py
from django.db import models
from django.utils.text import slugify
from django.urls import reverse

class CatalogueCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='catalogue/categories/', blank=True, null=True)
    
    class Meta:
        verbose_name_plural = 'Catalogue Categories'
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class RoomType(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class CatalogueItem(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    category = models.ForeignKey(CatalogueCategory, on_delete=models.PROTECT, related_name='items')
    room_types = models.ManyToManyField(RoomType, related_name='catalogue_items', blank=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    main_image = models.ImageField(upload_to='catalogue/items/')
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('catalogue-item-detail', kwargs={'slug': self.slug})

class ColorOption(models.Model):
    item = models.ForeignKey(CatalogueItem, on_delete=models.CASCADE, related_name='color_options')
    name = models.CharField(max_length=50)
    color_code = models.CharField(max_length=7)  # Hex color code
    image = models.ImageField(upload_to='catalogue/colors/', blank=True, null=True)
    additional_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    def __str__(self):
        return f"{self.name} for {self.item.name}"

class CatalogueImage(models.Model):
    item = models.ForeignKey(CatalogueItem, on_delete=models.CASCADE, related_name='additional_images')
    image = models.ImageField(upload_to='catalogue/item_images/')
    caption = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Image for {self.item.name}"
    
    def save(self, *args, **kwargs):
        if self.is_primary:
            # Ensure only one primary image exists
            CatalogueImage.objects.filter(item=self.item).update(is_primary=False)
        super().save(*args, **kwargs)