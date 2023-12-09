import pytest
import uuid
from market.models import Customer


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
def change_customer_to_artist():
    def customer_artist(**kwargs):
        customer = Customer.objects.get(user=kwargs["user"])
        customer.membership = 'A'
        customer.save()
    return customer_artist
        
