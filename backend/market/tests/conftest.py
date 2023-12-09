import uuid
import pytest
from rest_framework.test import APIClient
from market.models import Customer


@pytest.fixture
def api_client():
   return APIClient()


@pytest.fixture
def test_password():
   return 'strong-test-pass'

  
@pytest.fixture
def create_user(db, django_user_model, test_password):
    def make_user(**kwargs):
        kwargs['password'] = test_password
        if 'username' not in kwargs:
            kwargs['username'] = str(uuid.uuid4())
        return django_user_model.objects.create_user(**kwargs)
    return make_user


@pytest.fixture
def create_attist_customer(create_user):
    def artist_customer(**kwargs):
        if "user" not in kwargs:
            kwargs["user"] = create_user()
        customer = Customer.objects.get(**kwargs)
        customer.membership = 'A'
        customer.save()
        return kwargs['user']
    return artist_customer
        
