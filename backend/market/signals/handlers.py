from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from market.models import Customer, ListArt, Cart


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_customer_for_new_user(sender, **kwargs):
    if kwargs['created']:
        customer = Customer.objects.create(user=kwargs['instance'])
        ListArt.objects.create(customer=customer)
        Cart.objects.create(customer=customer)