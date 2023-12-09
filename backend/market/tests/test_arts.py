from rest_framework.test import APIClient
from rest_framework import status
# from market.models import Customer
from core.models import User
import pytest


@pytest.mark.django_db
class TestCreateArt:
    def test_if_user_is_anonymous_return_401(self):
        client = APIClient()
        response = client.post('/market/arts/', {'name': 'a', 'descriptions': 'b'})
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_if_user_is_not_admin_return_403(self):
        client = APIClient()
        client.force_authenticate(user={})
        response = client.post('/market/arts/', {'name': 'a', 'descriptions': 'b'})
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_data_is_invalid_return_400(self, create_user, change_customer_to_artist):
        client = APIClient()
        user = create_user()
        change_customer_to_artist(user=user)
        client.force_authenticate(user=user)
        
        response = client.post('/market/arts/', {'name': '', 'descriptions': 'b'})
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['name'] is not None
    
    def test_if_data_is_valid_return_201(self, create_user, change_customer_to_artist):
        client = APIClient()
        user = create_user()
        change_customer_to_artist(user=user)
        client.force_authenticate(user=user)

        response = client.post('/market/arts/', {'name': 'a', 'descriptions': 'b'})
        
        assert response.status_code == status.HTTP_201_CREATED
    



        