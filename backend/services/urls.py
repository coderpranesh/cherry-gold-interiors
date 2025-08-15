from django.urls import path
from .views import (
    ServiceRequestListCreateView,
    ServiceRequestRetrieveUpdateView,
    RepairRequestListView,
    ConsultationListView,
    OnsiteServiceListView,
    ServiceSequenceView
)

app_name = "services"

urlpatterns = [
    path('requests/', ServiceRequestListCreateView.as_view(), name='service-request-list'),
    path('requests/<str:service_number>/', ServiceRequestRetrieveUpdateView.as_view(), name='request-detail'),
    path('repairs/', RepairRequestListView.as_view(), name='repair-request-list'),
    path('consultations/', ConsultationListView.as_view(), name='consultation-list'),
    path('onsite/', OnsiteServiceListView.as_view(), name='onsite-service-list'),
    path('sequences/<str:year_month>/', ServiceSequenceView.as_view(), name='service-sequence'),
]