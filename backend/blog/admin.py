from django.contrib import admin
from parler.admin import TranslatableAdmin
from .models import BlogPost, BlogCategory, BlogTag

@admin.register(BlogPost)
class BlogPostAdmin(TranslatableAdmin):
    """
    Admin configuration for BlogPost model with translations support
    """
    list_display = ('title', 'author', 'category', 'status', 'published_date')
    list_filter = ('status', 'category', 'tags')
    search_fields = ('translations__title', 'translations__content')
    filter_horizontal = ('tags',)
    date_hierarchy = 'published_date'

    def save_model(self, request, obj, form, change):
        """
        Automatically set author to current user if not already set
        """
        if not obj.author_id:
            obj.author = request.user
        super().save_model(request, obj, form, change)

@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    """
    Admin configuration for BlogCategory model
    """
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(BlogTag)
class BlogTagAdmin(admin.ModelAdmin):
    """
    Admin configuration for BlogTag model
    """
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
