# Generated by Django 5.0.3 on 2025-02-20 20:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('funko_import', '0013_alter_promocion_id_producto'),
    ]

    operations = [
        migrations.AlterField(
            model_name='promocion',
            name='id_producto',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='funko_import.producto'),
        ),
    ]
