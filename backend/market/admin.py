from django.contrib import admin
from . import models

# Register your models here.

admin.site.register(models.ArtWork)
admin.site.register(models.Customer)
admin.site.register(models.CartItem)
admin.site.register(models.Cart)
admin.site.register(models.ListArt)
admin.site.register(models.Order)
admin.site.register(models.OrderItem)

