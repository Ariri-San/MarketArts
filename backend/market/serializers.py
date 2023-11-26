from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from core.serializers import UserSerializer, UserCreateSerializer
from likes.serializers import LikesSerializer
from . import models



# Customer Serializer    

class CustomerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = models.Customer
        fields = "__all__"
        extra_kwargs = {
            "membership": {"read_only": True},
        }

class AddCustomerSerializer(serializers.ModelSerializer):
    user = UserCreateSerializer()
    
    def create(self, validated_data):
        try:
            with transaction.atomic():
                user = get_user_model().objects.create_user(**dict(validated_data["user"]))
                validated_data["user"] = user
                customer = models.Customer.objects.create(**validated_data)
                models.ListArt.objects.create(customer=customer)
                models.Cart.objects.create(customer=customer)
            return customer
        except IntegrityError:
            self.fail("cannot_create_user")
    
    
    class Meta:
        model = models.Customer
        fields = ["user"]



# Art Work Serializer

class ArtWorkSerializer(serializers.ModelSerializer):
    owner = CustomerSerializer(read_only=True)
    artist = CustomerSerializer(read_only=True)
    
    def create(self, validated_data):
        if self.context["customer"]:
            validated_data["owner"] = self.context["customer"]
            validated_data["artist"] = self.context["customer"]
            return models.ArtWork.objects.create(**validated_data)
        raise serializers.ValidationError('Can Not Create Art.')
    
    class Meta:
        model = models.ArtWork
        fields = "__all__"
 



# List Art Serializer

class ListArtSerializer(serializers.ModelSerializer):
    list_arts = ArtWorkSerializer(read_only=True, many=True)
    list_buy_arts = ArtWorkSerializer(read_only=True, many=True)
    list_sell_arts = ArtWorkSerializer(read_only=True, many=True)
    
    class Meta:
        model = models.ListArt
        fields = "__all__"




# Cart Item Serializer

class CartItemSerializer(serializers.ModelSerializer):
    art = ArtWorkSerializer(read_only=True)
    
    class Meta:
        model = models.CartItem
        fields = "__all__"
        extra_kwargs = {
            "cart": {"read_only": True},
        }
        

class AddCartItemSerializer(serializers.ModelSerializer):
    
    def create(self, validated_data):
        cart_items = models.CartItem.objects.filter(cart_id=self.context["cart_id"])
        for item in cart_items:
            if item.art.id == validated_data["art"].id:
                raise serializers.ValidationError('You Have This Art In Your Cart.')
            
        art = models.ArtWork.objects.get(id=validated_data["art"].id)
        if art.owner.id == self.context["customer_id"]:
            raise serializers.ValidationError('You Have This Art.')

        return models.CartItem.objects.create(cart_id=self.context["cart_id"], **validated_data)
    
    class Meta:
        model = models.CartItem
        fields = ["art"]



# Cart Serializer

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many = True, read_only=True)
    
    class Meta:
        model = models.Cart
        fields = "__all__"



# Order Item Serializer

class OrderItemSerializer(serializers.ModelSerializer):
    art = ArtWorkSerializer(read_only=True)
    
    class Meta:
        model = models.OrderItem
        fields = "__all__"



# Order Serializer

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many = True, read_only=True)
    
    def create(self, validated_data):
        try:
            if models.Cart.objects.filter(customer_id=self.context['customer_id']):
                with transaction.atomic():
                    cart = models.Cart.objects.get(customer_id=self.context['customer_id'])
                    order = models.Order.objects.create(customer_id=self.context['customer_id'])
                    cart_items = models.CartItem.objects.filter(cart_id=cart.id)
                    
                    if (not cart_items):
                        raise serializers.ValidationError('You dont Have Item In Your Cart')
                    
                    order_items = [
                        models.OrderItem(
                            order=order,
                            art=item.art,
                            price=item.art.price,
                        ) for item in cart_items
                    ]
                    models.OrderItem.objects.bulk_create(order_items)

                    cart_items.delete()
                    
                    return order
            raise serializers.ValidationError('You dont Have Cart')
        except IntegrityError:
            self.fail("cannot_create_user")
    
    class Meta:
        model = models.Order
        fields = "__all__"
        extra_kwargs = {
            "customer": {"read_only": True},
            "payment_status": {"read_only": True},
        }
