# Generated by Django 4.2.7 on 2023-11-03 17:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('market', '0009_alter_cart_customer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cart',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
