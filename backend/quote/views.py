from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from .models import CostEstimation
from .serializers import CostEstimationSerializer

@api_view(['POST'])
def save_estimation(request):
    data = request.data.copy()
    
    # Set expiration date if not provided
    if 'expires_at' not in data:
        data['expires_at'] = timezone.now() + timedelta(days=7)
    
    serializer = CostEstimationSerializer(data=data)
    
    if serializer.is_valid():
        estimation = serializer.save()
        return Response({
            'id': estimation.id,
            'message': 'Estimation saved successfully. It will be available for 7 days.'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_estimation(request, estimation_id):
    try:
        estimation = CostEstimation.objects.get(id=estimation_id, expires_at__gte=timezone.now())
        serializer = CostEstimationSerializer(estimation)
        return Response(serializer.data)
    except CostEstimation.DoesNotExist:
        return Response(
            {'error': 'Estimation not found or has expired.'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
def list_estimations(request):
    # For admin purposes - list all non-expired estimations
    estimations = CostEstimation.objects.filter(expires_at__gte=timezone.now())
    serializer = CostEstimationSerializer(estimations, many=True)
    return Response(serializer.data)