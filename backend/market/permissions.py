from rest_framework import permissions
from .models import Customer, ArtWork


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class IsAdminOrArtist(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            if request.user:
                if request.user.is_staff:
                    return True
                
                customer = Customer.objects.get(user_id=request.user.id)
                if customer.membership == "A" and request.method == "POST":
                    return True
                
                elif request.method in ["PUT", "DELETE"]:
                    art = ArtWork.objects.get(id=view.kwargs["pk"])
                    if art.owner.user.id == request.user.id:
                        return True
        return False
