# Generated by Django 4.2.7 on 2023-11-06 06:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('market', '0012_listart_list_arts'),
    ]

    operations = [
        migrations.RenameField(
            model_name='orderitem',
            old_name='unit_price',
            new_name='price',
        ),
    ]
