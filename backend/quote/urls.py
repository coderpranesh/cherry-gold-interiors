from django.urls import path
from . import views

urlpatterns = [
    path('api/estimations/', views.save_estimation, name='save_estimation'),
    path('api/estimations/<uuid:estimation_id>/', views.get_estimation, name='get_estimation'),
    path('api/admin/estimations/', views.list_estimations, name='list_estimations'),
]