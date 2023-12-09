from rest_framework.test import APIClient
from rest_framework import status
import pytest


@pytest.fixture
def create_art(api_client):
    def do_create_art(art={'name': 'a', 'descriptions': 'b'}, user=False):
        client = api_client
        if user != False:
            client.force_authenticate(user=user)
        return client.post('/market/arts/', art)
    return do_create_art



@pytest.mark.django_db
class TestCreateArt:
    def test_if_user_is_anonymous_return_401(self, create_art):
        response = create_art()
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


    def test_if_user_is_not_admin_return_403(self, create_art):
        response = create_art(user={})
        
        assert response.status_code == status.HTTP_403_FORBIDDEN


    def test_if_data_is_invalid_return_400(self, create_attist_customer, create_art):
        user = create_attist_customer()
        response = create_art(art={'name': '', 'descriptions': 'b'}, user=user)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['name'] is not None


    def test_if_data_is_valid_return_201(self, create_attist_customer, create_art):
        user = create_attist_customer()
        response = create_art(user=user)
        
        assert response.status_code == status.HTTP_201_CREATED
    



        