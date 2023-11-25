from rest_framework_nested import routers
from . import views

router = routers.DefaultRouter()
router.register('arts', views.ArtWorkViewSet, basename='arts')
router.register('customers', views.CustomerViewSet, basename='customers')


customers_router = routers.NestedDefaultRouter(router, 'customers', lookup='customer')
customers_router.register('carts', views.CartViewSet, basename='carts')
customers_router.register('orders', views.OrderViewSet, basename='orders')
customers_router.register('arts', views.ListArtViewSet, basename='list-arts')


carts_customers_router = routers.NestedDefaultRouter(customers_router, 'carts', lookup='cart')
carts_customers_router.register('items', views.CartItemViewSet, basename='item')

# orders_customers_router = routers.NestedDefaultRouter(customers_router, 'orders', lookup='order')
# orders_customers_router.register('items', views.OrderItemViewSet, basename='item')


urlpatterns = router.urls
urlpatterns += customers_router.urls
urlpatterns += carts_customers_router.urls
# urlpatterns += orders_customers_router.urls
