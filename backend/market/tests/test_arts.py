from rest_framework import status
import pytest
from collections import OrderedDict
from model_bakery import baker
from market.models import ArtWork, Customer


@pytest.fixture
def create_art(api_client):
    def do_create_art(art={'name': 'a', 'descriptions': 'b'}, user=False):
        client = api_client
        if user != False:
            client.force_authenticate(user=user)
        return client.post('/market/arts/', art)
    return do_create_art


@pytest.fixture
def get_art(api_client):
    def do_get_art(art, user=False):
        client = api_client
        if user != False:
            client.force_authenticate(user=user)
        return client.get(f'/market/arts/{art.id}/')
    return do_get_art



@pytest.mark.django_db
class TestCreateArt:
    def test_if_user_is_anonymous_return_401(self, create_art):
        response = create_art()
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


    def test_if_user_is_not_admin_return_403(self, create_art):
        response = create_art(user={})
        
        assert response.status_code == status.HTTP_403_FORBIDDEN


    def test_if_data_is_invalid_return_400(self, create_attist_customer, create_art):
        user = create_attist_customer()["user"]
        response = create_art(art={'name': '', 'descriptions': 'b'}, user=user)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['name'] is not None


    def test_if_data_is_valid_return_201(self, create_attist_customer, create_art):
        user = create_attist_customer()["user"]
        response = create_art(user=user)
        
        assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
class TestRetrieveArt:
    def test_if_art_exist_return_200(self, create_attist_customer, get_art):
        customer = create_attist_customer()["customer"]
        art = baker.make(ArtWork, artist=customer, owner=customer)
        response = get_art(art)
            
        # object_list = ["id", "name", "descriptions", "artist_id"]
        # response_list = ["id", "name", "descriptions", "artist"]
        # check_dict = lambda x: x["id"] if type(x) == OrderedDict else x
        
        # art_check = {item: check_dict(art.__dict__[item]) for item in object_list}
        # response_check = {item: check_dict(response.data[item]) for item in response_list}
        
        assert response.status_code == status.HTTP_200_OK
            


        