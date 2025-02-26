from django.contrib import admin
from .models import Usuario, Coleccion, Descuento, Producto, Promocion, IngresoStock,PeticionProducto, ResenaComentario, Pregunta,Edicion, Factura, LineaFactura, carrito, Venta

# Register your models here.
admin.site.register(Usuario)
admin.site.register(Coleccion)
admin.site.register(Descuento)
admin.site.register(Producto)
admin.site.register(Promocion)
admin.site.register(IngresoStock)
admin.site.register(PeticionProducto)
admin.site.register(ResenaComentario)
admin.site.register(Pregunta)
admin.site.register(Edicion)
admin.site.register(Factura)
admin.site.register(LineaFactura)
admin.site.register(carrito)
admin.site.register(Venta)