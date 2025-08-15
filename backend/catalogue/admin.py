#backend/catalogue/admin.py
from django.contrib import admin
from .models import CatalogueItem, CatalogueCategory, ColorOption, RoomType

class ColorOptionInline(admin.TabularInline):
    model = ColorOption
    extra = 1

@admin.register(CatalogueItem)
class CatalogueItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'base_price', 'is_featured')
    list_filter = ('category', 'room_types', 'is_featured')
    search_fields = ('name', 'description')
    inlines = [ColorOptionInline]
    filter_horizontal = ('room_types',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(CatalogueCategory)
class CatalogueCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(RoomType)
class RoomTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}