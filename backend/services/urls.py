from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceRequestViewSet,
    ConsultationBookingViewSet,
    RepairRequestViewSet,
    OnSiteServiceViewSet,
    ServiceCalendarView,
    AvailableTimeSlotsView,
)

router = DefaultRouter()
router.register(r'requests', ServiceRequestViewSet, basename='servicerequest')
router.register(r'consultations', ConsultationBookingViewSet, basename='consultation')
router.register(r'repairs', RepairRequestViewSet, basename='repairrequest')
router.register(r'onsite', OnSiteServiceViewSet, basename='onsiteservice')

urlpatterns = [
    path('calendar/', ServiceCalendarView.as_view(), name='service-calendar'),
    path('timeslots/', AvailableTimeSlotsView.as_view(), name='available-timeslots'),
] + router.urls