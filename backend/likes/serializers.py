from rest_framework import serializers
from core.serializers import UserSerializer
from . import models


class LikesSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = models.LikedItem
        fields = "__all__"
        # fields = ["id", "user", "content_type", "object_id"]
        extra_kwargs = {
            "content_type": {"read_only": True},
        }