from rest_framework.test import APIClient
from rest_framework import status
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

    


        