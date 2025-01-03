from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import IngresoStock, Producto

@receiver(post_save, sender=IngresoStock)
def actualizar_stock_producto(sender, instance, created, **kwargs):
    if created:  # Solo cuando se crea un nuevo registro de IngresoStock
        producto = instance.idProducto
        producto.cantidadDisp += instance.cantidadIngresa
        producto.save()
