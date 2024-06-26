from django.core.management.base import BaseCommand
from core.models import User
import environ
import os

env = environ.Env()
environ.Env.read_env()


class Command(BaseCommand):
    def handle(self, *args, **options):
        if User.objects.count() == 0:
            # username = env('USERNAME')
            # email = env('EMAIL')
            # password = env('PASSWORD')
            
            username = "admin"
            email = "admin@admin.com"
            password = "useradmin"
            
            print('Creating account for %s (%s)' % (username, email))
            User.objects.create_superuser(email=email, username=username, password=password)
        else:
            print('Admin accounts can only be initialized if no Accounts exist')
