# Generated by Django 5.0.3 on 2025-02-21 19:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('funko_import', '0016_usuario_token'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuario',
            name='token',
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
    ]
