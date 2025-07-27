from django.db import models
from django.utils.translation import gettext_lazy as _
from django.urls import reverse
from django.utils import timezone
from django.conf import settings
from parler.models import TranslatableModel, TranslatedFields
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from ckeditor.fields import RichTextField

def validate_featured_image_size(value):
    limit = 2 * 1024 * 1024
    if value.size > limit:
        raise ValidationError(_('Featured image too large (max 2MB)'))

class BlogCategory(models.Model):
    name = models.CharField(_("Name"), max_length=100)
    slug = models.SlugField(_("Slug"), max_length=100, unique=True)
    description = models.TextField(_("Description"), blank=True)
    image = models.ImageField(
        _("Category Image"),
        upload_to='blog/categories/',
        blank=True,
        null=True,
        validators=[validate_featured_image_size]
    )
    order = models.PositiveIntegerField(_("Display Order"), default=0)

    class Meta:
        verbose_name = _("Blog Category")
        verbose_name_plural = _("Blog Categories")
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('blog:category-posts', kwargs={'slug': self.slug})

class BlogTag(models.Model):
    name = models.CharField(_("Name"), max_length=50)
    slug = models.SlugField(_("Slug"), max_length=50, unique=True)
    show_in_filter = models.BooleanField(_("Show in filters"), default=True)

    class Meta:
        verbose_name = _("Blog Tag")
        verbose_name_plural = _("Blog Tags")
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('blog:tag-posts', kwargs={'slug': self.slug})

class BlogPost(TranslatableModel):
    STATUS_CHOICES = [
        ('DRAFT', _("Draft")),
        ('PUBLISHED', _("Published")),
        ('ARCHIVED', _("Archived")),
    ]

    translations = TranslatedFields(
        title=models.CharField(_("Title"), max_length=200),
        excerpt=models.TextField(_("Excerpt"), blank=True),
        content=RichTextField(_("Content")),
        meta_title=models.CharField(_("Meta Title"), max_length=100, blank=True, help_text=_("SEO title")),
        meta_description=models.CharField(_("Meta Description"), max_length=200, blank=True, help_text=_("SEO description")),
    )

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='blog_posts',
        verbose_name=_("Author")
    )
    category = models.ForeignKey(
        BlogCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='posts',
        verbose_name=_("Category")
    )
    tags = models.ManyToManyField(
        BlogTag,
        blank=True,
        related_name='posts',
        verbose_name=_("Tags")
    )
    featured_image = models.ImageField(
        _("Featured Image"),
        upload_to='blog/featured_images/%Y/%m/',
        validators=[validate_featured_image_size]
    )
    status = models.CharField(_("Status"), max_length=10, choices=STATUS_CHOICES, default='DRAFT')
    published_date = models.DateTimeField(_("Published Date"), null=True, blank=True)
    created_at = models.DateTimeField(_("Created At"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated At"), auto_now=True)
    view_count = models.PositiveIntegerField(_("View Count"), default=0)
    is_featured = models.BooleanField(_("Featured Post"), default=False)
    slug = models.SlugField(_("Slug"), max_length=200, unique=True)

    class Meta:
        verbose_name = _("Blog Post")
        verbose_name_plural = _("Blog Posts")
        ordering = ['-published_date']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if self.status == 'PUBLISHED' and not self.published_date:
            self.published_date = timezone.now()
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('blog:post-detail', kwargs={'slug': self.slug})

    def increment_view_count(self):
        self.view_count += 1
        self.save(update_fields=['view_count'])

class BlogComment(models.Model):
    post = models.ForeignKey(
        BlogPost,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name=_("Blog Post")
    )
    name = models.CharField(_("Name"), max_length=100)
    email = models.EmailField(_("Email"))
    content = models.TextField(_("Comment"))
    created_at = models.DateTimeField(_("Created At"), auto_now_add=True)
    approved = models.BooleanField(_("Approved"), default=False)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies',
        verbose_name=_("Parent Comment")
    )

    class Meta:
        verbose_name = _("Blog Comment")
        verbose_name_plural = _("Blog Comments")
        ordering = ['-created_at']

    def __str__(self):
        return f"Comment by {self.name} on {self.post.title}"

class BlogSEO(models.Model):
    meta_title = models.CharField(_("Default Meta Title"), max_length=100, default="Cherry Gold Interiors Blog")
    meta_description = models.CharField(_("Default Meta Description"), max_length=200, default="Latest interior design trends and tips from Cherry Gold Interiors")
    og_image = models.ImageField(_("Default Open Graph Image"), upload_to='blog/seo/', blank=True)

    class Meta:
        verbose_name = _("Blog SEO Settings")
        verbose_name_plural = _("Blog SEO Settings")

    def __str__(self):
        return "Blog SEO Configuration"
