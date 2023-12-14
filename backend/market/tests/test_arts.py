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
    def do_get_art(id="", user=False):
        client = api_client
        if user != False:
            client.force_authenticate(user=user)
        if id:
            id = str(id) + '/'
        print(f'/market/arts/{id}')
        return client.get(f'/market/arts/{id}')
    return do_get_art


@pytest.fixture
def put_art(api_client):
    def do_put_art(id, art={}, user=False):
        client = api_client
        if user != False:
            client.force_authenticate(user=user)
        return client.put(f'/market/arts/{id}/', art)
    return do_put_art


@pytest.fixture
def delete_art(api_client):
    def do_delete_art(id, user=False):
        client = api_client
        if user != False:
            client.force_authenticate(user=user)
        return client.delete(f'/market/arts/{id}/')
    return do_delete_art



@pytest.mark.django_db
class TestCreateArt:
    def test_if_user_is_anonymous_return_401(self, create_art):
        response = create_art()
        print(response.data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


    def test_if_user_is_not_admin_return_403(self, create_art):
        response = create_art(user={})
        
        assert response.status_code == status.HTTP_403_FORBIDDEN


    def test_if_data_is_invalid_return_400(self, create_attist_customer, create_art):
        user = create_attist_customer()["user"]
        
        response = create_art(art={'name': '', 'descriptions': 'b'}, user=user)
        print(response.data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['name'] is not None


    def test_if_data_is_valid_return_201(self, create_attist_customer, create_art):
        user = create_attist_customer()["user"]
        
        response = create_art(user=user)
        print(response.data)
        
        assert response.status_code == status.HTTP_201_CREATED



@pytest.mark.django_db
class TestRetrieveArt:
    def test_if_art_exist_return_200(self, create_attist_customer, get_art):
        customer = create_attist_customer()["customer"]
        art = baker.make(ArtWork, artist=customer, owner=customer)
        
        response = get_art(art.id)
        print(response.data)
        
        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestListArt:
    def test_if_arts_exist_return_200(self, create_attist_customer, get_art):
        customer = create_attist_customer()["customer"]
        baker.make(ArtWork, artist=customer, owner=customer, _quantity=10)
        
        response = get_art()
        print(response.data)
        
        assert response.status_code == status.HTTP_200_OK


          
@pytest.mark.django_db
class TestChangeArt:
    def test_if_user_is_anonymous_return_401(self, create_attist_customer, put_art):
        customer = create_attist_customer()["customer"]
        
        art = baker.make(ArtWork, artist=customer, owner=customer)
        art_2 = baker.make(ArtWork, artist=customer, owner=customer)
        put_data = {item: art_2.__dict__[item] for item in art_2.__dict__ if item in ["name", "price", "show_art"]}

        response = put_art(art.id, put_data)
        print(response.data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


    def test_if_user_is_not_admin_return_403(self, create_attist_customer, put_art):
        customer = create_attist_customer()["customer"]
        
        art = baker.make(ArtWork, artist=customer, owner=customer)
        art_2 = baker.make(ArtWork, artist=customer, owner=customer)
        put_data = {item: art_2.__dict__[item] for item in art_2.__dict__ if item in ["name", "price", "show_art"]}

        response = put_art(art.id, put_data, {})
        print(response.data)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN


    def test_if_data_is_invalid_return_400(self, create_attist_customer, put_art):
        user_customer = create_attist_customer()
        customer = user_customer["customer"]
        user = user_customer["user"]
        
        art = baker.make(ArtWork, artist=customer, owner=customer)
        art_2 = baker.make(ArtWork, artist=customer, owner=customer)
        put_data = {item: art_2.__dict__[item] for item in art_2.__dict__ if item in ["name", "price", "show_art"]}
         
        response = put_art(art.id, put_data, user)
        print(response.data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


    def test_if_data_is_valid_return_201(self, create_attist_customer, put_art):
        user_customer = create_attist_customer()
        customer = user_customer["customer"]
        user = user_customer["user"]
        
        art = baker.make(ArtWork, artist=customer, owner=customer)
        art_2 = baker.make(ArtWork, artist=customer, owner=customer)
        put_data = {item: art_2.__dict__[item] for item in art_2.__dict__ if item in ["name", "price", "show_art"]}
        put_data["name"] = put_data["name"][:-10] + "abc"

        response = put_art(art.id, put_data, user)
        print(response.data)
        
        assert response.status_code == status.HTTP_200_OK


      
@pytest.mark.django_db
class TestDeleteArt:
    def test_if_user_is_anonymous_return_401(self, create_attist_customer, delete_art):
        customer = create_attist_customer()["customer"]
        
        art = baker.make(ArtWork, artist=customer, owner=customer)

        response = delete_art(art.id)
        print(response.data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


    def test_if_user_is_not_admin_return_403(self, create_attist_customer, delete_art):
        customer = create_attist_customer()["customer"]
        
        art = baker.make(ArtWork, artist=customer, owner=customer)

        response = delete_art(art.id, {})
        print(response.data)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN


    def test_if_data_is_valid_return_201(self, create_attist_customer, delete_art):
        user_customer = create_attist_customer()
        customer = user_customer["customer"]
        user = user_customer["user"]
        
        art = baker.make(ArtWork, artist=customer, owner=customer)

        response = delete_art(art.id, user)
        print(response.data)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT

