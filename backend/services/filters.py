import django_filters
from .models import ServiceRequest
from django.utils import timezone

class ServiceRequestFilter(django_filters.FilterSet):
    urgent = django_filters.BooleanFilter(method='filter_urgent')
    
    class Meta:
        model = ServiceRequest
        fields = ['service_type', 'status', 'project_type']

    def filter_urgent(self, queryset, name, value):
        if value:
            return queryset.filter(
                status__in=['new', 'in_progress'],
                preferred_date__lte=timezone.now() + timezone.timedelta(days=3)
            )
        return queryset