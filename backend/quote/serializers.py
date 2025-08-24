from rest_framework import serializers
from .models import CostEstimation

class CostEstimationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CostEstimation
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'expires_at')