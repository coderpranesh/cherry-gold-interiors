#backend/blog/admin.py
from django.contrib import admin
from parler.admin import TranslatableAdmin
from .models import BlogPost, BlogCategory, BlogTag


@admin.register(BlogPost)
class BlogPostAdmin(TranslatableAdmin):
    """
    Admin configuration for BlogPost with translation support.
    """
    list_display = ('title', 'category', 'status', 'published_date')
    list_filter = ('status', 'category', 'tags')
    search_fields = ('translations__title', 'translations__content')
    filter_horizontal = ('tags',)
    date_hierarchy = 'published_date'
    ordering = ('-published_date',)

    def get_title(self, obj):
        return obj.safe_translation_getter('title', any_language=True) or "Untitled"
    get_title.short_description = 'Title'

    def save_model(self, request, obj, form, change):
        """
        Automatically assign the logged-in user as the author if not already set.
        """
        if not hasattr(obj, 'author') or not obj.author_id:
            obj.author = request.user
        super().save_model(request, obj, form, change)


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    """
    Admin configuration for BlogCategory.
    """
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)


@admin.register(BlogTag)
class BlogTagAdmin(admin.ModelAdmin):
    """
    Admin configuration for BlogTag.
    """
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)
