from django.urls import path
from . import views

urlpatterns = [
    # Clean paths
    path('estimations/', views.save_estimation, name='save_estimation'),
    path('estimations/<str:estimation_id>/', views.get_estimation, name='get_estimation'),
    path('admin/estimations/', views.list_estimations, name='list_estimations'),
    
    # Backwards compatibility with nested api/
    path('api/estimations/', views.save_estimation, name='save_estimation_compat'),
    path('api/estimations/<str:estimation_id>/', views.get_estimation, name='get_estimation_compat'),
    path('api/admin/estimations/', views.list_estimations, name='list_estimations_compat'),
]