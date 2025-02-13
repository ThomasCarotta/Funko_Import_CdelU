# Generated by Django 5.0.3 on 2025-02-12 18:59

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('funko_import', '0005_rename_idfactura_codigoseguimiento_id_factura_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='lineafactura',
            name='precioUnitario',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10, validators=[django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AddField(
            model_name='productocarrito',
            name='precioUnitario',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10, validators=[django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AlterField(
            model_name='producto',
            name='URLImagen',
            field=models.URLField(validators=[django.core.validators.URLValidator()]),
        ),
    ]
