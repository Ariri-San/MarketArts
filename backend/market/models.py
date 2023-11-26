# from uuid import uuid4
from django.db import models
from django.conf import settings
from .validators import validate_file_size


# Create your models here.


class Customer(models.Model):
    MEMBERSHIP_ARTIST = 'A'
    MEMBERSHIP_CUSTOMER = 'C'

    MEMBERSHIP_CHOICES = [
        (MEMBERSHIP_ARTIST, 'Artist'),
        (MEMBERSHIP_CUSTOMER, 'Customer'),
    ]
    membership = models.CharField(max_length=1, choices=MEMBERSHIP_CHOICES, default=MEMBERSHIP_CUSTOMER)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user.username}'

    class Meta:
        ordering = ['user__first_name', 'user__last_name', 'user__username']



class ArtWork(models.Model):
    name = models.CharField(max_length=128, unique=True)
    descriptions = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='Arts/images',validators=[validate_file_size], null=True, blank=True)
    artist = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="artist")
    owner = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="owner")
    price = models.BigIntegerField(blank=True, null=True)
    show_art = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name



class ListArt(models.Model):
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE)
    list_arts = models.ManyToManyField(ArtWork, related_name="list_arts", blank=True)
    list_buy_arts = models.ManyToManyField(ArtWork, related_name="list_buy_arts", blank=True)
    list_sell_arts = models.ManyToManyField(ArtWork, related_name="list_sell_arts", blank=True)
    
    def __str__(self):
        return f'{self.customer.user.username}'
    


class Cart(models.Model):
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'{self.customer.user.username}'


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    art = models.ForeignKey(ArtWork, on_delete=models.CASCADE)

    class Meta:
        unique_together = [['cart', 'art']]
        
    def __str__(self):
        return f'{self.art}'


class Order(models.Model):
    PAYMENT_STATUS_PENDING = 'P'
    PAYMENT_STATUS_COMPLETE = 'C'
    PAYMENT_STATUS_FAILED = 'F'
    PAYMENT_STATUS_CHOICES = [
        (PAYMENT_STATUS_PENDING, 'Pending'),
        (PAYMENT_STATUS_COMPLETE, 'Complete'),
        (PAYMENT_STATUS_FAILED, 'Failed')
    ]

    placed_at = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(
        max_length=1, choices=PAYMENT_STATUS_CHOICES, default=PAYMENT_STATUS_PENDING)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)

    class Meta:
        permissions = [
            ('cancel_order', 'Can cancel order')
        ]


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, on_delete=models.PROTECT, related_name='items')
    art = models.ForeignKey(
        ArtWork, on_delete=models.PROTECT)
    price = models.BigIntegerField()
    
    def __str__(self):
        return f'{self.art}'
