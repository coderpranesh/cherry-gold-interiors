from django.contrib import admin
from .models import (
    PortfolioItem,
    PortfolioImage,
    PortfolioVideo,
    PortfolioFeature,
    PortfolioMaterial,
    CaseStudy
)


class PortfolioImageInline(admin.TabularInline):
    model = PortfolioImage
    extra = 1
    fields = ('image', 'caption', 'order')
    ordering = ('order',)


class PortfolioVideoInline(admin.TabularInline):
    model = PortfolioVideo
    extra = 1
    fields = ('video_url', 'caption', 'order')
    ordering = ('order',)


class PortfolioFeatureInline(admin.TabularInline):
    model = PortfolioFeature
    extra = 1
    fields = ('feature',)


class PortfolioMaterialInline(admin.TabularInline):
    model = PortfolioMaterial
    extra = 1
    fields = ('material',)

# --- PortfolioItem Admin ---

@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'is_featured', 'created_at')
    list_filter = ('category', 'is_featured')
    search_fields = ('title', 'description', 'location')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        (None, {
            'fields': (
                'title', 'slug', 'category', 'location',
                'main_image', 'description', 'detailed_description',
                'completion_time', 'budget', 'is_featured'
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    inlines = [
        PortfolioImageInline,
        PortfolioVideoInline,
        PortfolioFeatureInline,
        PortfolioMaterialInline,
    ]

# --- CaseStudy Admin ---

@admin.register(CaseStudy)
class CaseStudyAdmin(admin.ModelAdmin):
    list_display = ('title', 'portfolio_item', 'created_at')
    search_fields = ('title', 'content')
    raw_id_fields = ('portfolio_item',)
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        (None, {
            'fields': (
                'portfolio_item', 'title', 'content',
                'before_image', 'after_image'
            )
        }),
        ('Challenges & Solutions', {
            'fields': ('challenges', 'solutions'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
