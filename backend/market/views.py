from typing import Any
from rest_framework.viewsets import ModelViewSet, mixins, GenericViewSet
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from . import serializers, models, permissions

# Create your views here.


class ArtWorkViewSet(ModelViewSet):
    queryset = models.ArtWork.objects.all().select_related("artist__user").select_related("owner__user")
    serializer_class = serializers.ArtWorkSerializer
    permission_classes = [permissions.IsAdminOrArtist]
    
    def get_serializer_context(self):
        return {
            'request': self.request,
            'user': self.request.user,
        }



class ListArtViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, GenericViewSet):
    serializer_class = serializers.ListArtSerializer
    permission_classes = [permissions.IsAdminOrCustomer]
    
    def get_queryset(self):
        return models.ListArt.objects.filter(customer=self.kwargs["customer_pk"]).all()



class CustomerViewSet(ModelViewSet):
    def get_queryset(self):
        return models.Customer.objects.filter(user_id=self.request.user.id).all().select_related("user")
    
    def get_serializer_class(self):
        if self.request.method == "POST":
            return serializers.AddCustomerSerializer
        return serializers.CustomerSerializer
    
    def get_permissions(self):
        if self.request.method in ['HEAD', 'OPTIONS', 'POST']:
            return []
        return [IsAuthenticated()]



class CartViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, GenericViewSet):
    permission_classes = [permissions.IsAdminOrCustomer]
    serializer_class = serializers.CartSerializer
    
    def get_queryset(self):
        return models.Cart.objects.filter(customer_id=self.kwargs["customer_pk"]).all().prefetch_related("items__art")



class CartItemViewSet(ModelViewSet):
    permission_classes = [permissions.IsAdminOrCustomer]
    
    def get_queryset(self):
        cart = models.Cart.objects.get(customer_id=self.kwargs["customer_pk"])
        return models.CartItem.objects.filter(cart_id=cart.id).all().select_related("art__owner__user").select_related("art__artist__user")
    
    def get_serializer_class(self):
        if self.request.method in ["POST", "DELETE"]:
            return serializers.AddCartItemSerializer
        return serializers.CartItemSerializer
    
    def get_serializer_context(self):
        cart = models.Cart.objects.get(customer_id=self.kwargs["customer_pk"])
        return {
            'request': self.request,
            'format': self.format_kwarg,
            'view': self,
            'cart_id': cart.id,
            'customer_id': self.kwargs["customer_pk"],
        }



class OrderViewSet(ModelViewSet):
    permission_classes = [permissions.IsAdminOrCustomer]
    serializer_class = serializers.OrderSerializer
    
    def get_queryset(self):
        return models.Order.objects.filter(customer=self.kwargs["customer_pk"]).prefetch_related("items__art").all()
    
    def get_serializer_context(self):
        return {
            'request': self.request,
            'format': self.format_kwarg,
            'view': self,
            'customer_id': self.kwargs["customer_pk"],
        }



