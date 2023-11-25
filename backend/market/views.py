from rest_framework.viewsets import ModelViewSet, mixins, GenericViewSet
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from . import serializers, models, permissions

# Create your views here.


class ArtWorkViewSet(ModelViewSet):
    queryset = models.ArtWork.objects.all().select_related("artist__user").select_related("owner__user")
    serializer_class = serializers.ArtWorkSerializer
    permission_classes = [permissions.IsAdminOrArtist]
    
    def get_serializer_context(self):
        if self.request.method == "POST":
            customer = models.Customer.objects.get(user_id=self.request.user.id)
        else:
            customer = None
        return {
            'request': self.request,
            'format': self.format_kwarg,
            'view': self,
            'customer': customer
        }



class ListArtViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, GenericViewSet):
    serializer_class = serializers.ListArtSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        customer = models.Customer.objects.get(user_id=self.request.user.id)
        return models.ListArt.objects.filter(customer=customer).all()



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
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        customer = models.Customer.objects.get(user_id=self.request.user.id)
        return models.Cart.objects.filter(customer_id=customer.id).all().prefetch_related("items__art")
    serializer_class = serializers.CartSerializer



class CartItemViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        customer = models.Customer.objects.get(user_id=self.request.user.id)
        cart = models.Cart.objects.get(customer_id=customer.id)
        return models.CartItem.objects.filter(cart_id=cart.id).all().select_related("art__owner__user").select_related("art__artist__user")
    
    def get_serializer_class(self):
        if self.request.method == "POST" or self.request.method == "PUT":
            return serializers.AddCartItemSerializer
        return serializers.CartItemSerializer
    
    def get_serializer_context(self):
        customer = models.Customer.objects.get(user_id=self.request.user.id)
        cart = models.Cart.objects.get(customer_id=customer.id)
        return {
            'request': self.request,
            'format': self.format_kwarg,
            'view': self,
            'cart_id': cart.id
        }



class OrderViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.OrderSerializer
    
    def get_queryset(self):
        customer = models.Customer.objects.get(user_id=self.request.user.id)
        return models.Order.objects.filter(customer=customer).prefetch_related("items__art").all()
    
    def get_serializer_context(self):
        customer = models.Customer.objects.get(user_id=self.request.user.id)
        return {
            'request': self.request,
            'format': self.format_kwarg,
            'view': self,
            'customer_id': customer.id
        }



