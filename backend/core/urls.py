from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
   openapi.Info(
      title="Cherry Gold Interiors API",
      default_version='v1',
      description="API documentation for Cherry Gold Interiors",
      terms_of_service="https://www.cherrygoldinteriors.com/terms/",
      contact=openapi.Contact(email="contact@cherrygoldinteriors.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/portfolio/', include('portfolio.urls')),
    path('api/catalogue/', include('catalogue.urls')),
    path('api/services/', include('services.urls')),
    path('api/projects/', include('projects.urls')),
    path('api/chatbot/', include('chatbot.urls')),
    path('api/blog/', include('blog.urls')),
    
    # Documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)