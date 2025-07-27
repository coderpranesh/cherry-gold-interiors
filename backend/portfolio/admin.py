from django.contrib import admin
from .models import PortfolioItem, PortfolioImage, PortfolioVideo, CaseStudy

class PortfolioImageInline(admin.TabularInline):
    model = PortfolioImage
    extra = 1

class PortfolioVideoInline(admin.TabularInline):
    model = PortfolioVideo
    extra = 1

@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'is_featured', 'created_at')
    list_filter = ('category', 'is_featured')
    search_fields = ('title', 'description')
    inlines = [PortfolioImageInline, PortfolioVideoInline]
    prepopulated_fields = {'slug': ('title',)}

@admin.register(CaseStudy)
class CaseStudyAdmin(admin.ModelAdmin):
    list_display = ('title', 'portfolio_item', 'created_at')
    search_fields = ('title', 'content')
    raw_id_fields = ('portfolio_item',)