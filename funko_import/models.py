from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator, URLValidator
from django.core.exceptions import ValidationError
from django.utils import timezone


import string
import random
from decimal import Decimal

# Obtener nombre y apellido concatenados

class Usuario(models.Model): 
    idUsuario= models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    direccion = models.CharField(max_length=255)
    correo = models.EmailField()
    telefono = models.CharField(max_length=15)
    rol = models.BooleanField(default=False)
    
    def __str__(self):
        return f'{self.idUsuario} - {self.nombre}'

class Coleccion(models.Model):
    idColeccion = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=100, unique=True) 

    @property
    def cantidad(self):
        return self.productos.count()

    def clean(self):
        super().clean()
        if Coleccion.objects.exclude(idColeccion=self.idColeccion).filter(nombre=self.nombre).exists():
            raise ValidationError({'nombre': 'Ya existe una colección con este nombre.'})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre
 
class Edicion(models.Model):
    id_edicion = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=100, unique=True)
    
    @property
    def cantidad(self):
        return self.productos.count()

    def __str__(self):
        return self.nombre

    def clean(self):
        if Edicion.objects.exclude(id_edicion=self.id_edicion).filter(nombre=self.nombre).exists():
            raise ValidationError({'nombre': 'Ya existe una edición con este nombre.'})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

#!calcular el total del carrito
#!que no haya mas de 2 carritos con el mismo usuario
class carrito(models.Model): #!CRUD
    idCarrito = models.BigAutoField(primary_key=True)
    total = models.FloatField(validators=[MinValueValidator(0)], default=0.0)
    idUsuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    def calcular_total(self):
        productos_carrito = ProductoCarrito.objects.filter(id_carrito=self)
        # total = 0
        # for producto_carrito in productos_carrito:
        #     total += producto_carrito.cantidad * producto_carrito.id_producto.precio
        # return total
        total = sum(producto_carrito.cantidad * producto_carrito.precioUnitario for producto_carrito in productos_carrito)
        return total
    
    def aplicar_descuento(self, porcentaje):
        subtotal = self.calcular_total()
        self.total = subtotal * (1 - porcentaje)
        self.save()

    def actualizar_total(self):
        self.total = self.calcular_total()
        self.save()

    def clean(self):
        # Verificar si el usuario ya tiene un carrito
        if carrito.objects.filter(idUsuario=self.idUsuario).exclude(idCarrito=self.idCarrito).exists():
            raise ValidationError({'idUsuario': 'El usuario ya tiene un carrito asignado.'})

    def save(self, *args, **kwargs):
        # Llamar a la validación antes de guardar
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.idCarrito} - {self.total}'

#!Generar automaricamente codigos de descuento
#Que el descuento se aplique al carrito y cuando termine la validez del descuento vuelva al precio original
#!Que no haya mas de 2 descuentos al mismo carrito (echo en carritoDescuento)
#!Que todos los codigos de descuento sean distintos
class Descuento(models.Model): #!CRUD
    idDescuento = models.AutoField(primary_key=True)
    codigoDescuento = models.CharField(max_length=50, unique=True)
    fechaInicio = models.DateField()
    fechaFin = models.DateField() 
    porcentaje = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(1)]) 
    
    def __str__(self):
        return self.codigoDescuento
    
    def clean(self):
        super().clean()
        # Validar que no existan códigos de descuento duplicados en el modelo Descuento
        if Descuento.objects.exclude(pk=self.pk).filter(codigoDescuento=self.codigoDescuento).exists():
            raise ValidationError({'codigoDescuento': 'Ya existe un descuento con este código.'})


    def generar_codigo(self):
        longitud_codigo = 20  # Longitud del código
        caracteres = string.ascii_uppercase + string.digits
        while True:
            nuevo_codigo = ''.join(random.choices(caracteres, k=longitud_codigo))
            if not Descuento.objects.filter(codigoDescuento=nuevo_codigo).exists():
                return nuevo_codigo

    def save(self, *args, **kwargs):
        if not self.codigoDescuento:  # Solo generar código si es nuevo
            self.codigoDescuento = self.generar_codigo()
        super().save(*args, **kwargs)
    
 #!que 2 productos no tengan el mismo numero si pertenecen a la misma coleccion
 #reducir stock al hacer compra
class Producto(models.Model): #!CRUD
    idProducto = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    numero = models.IntegerField(validators=[MinValueValidator(1)])
    esEspecial = models.BooleanField() #elimino (default=False)
    descripcion = models.CharField(max_length=255)
    brilla = models.BooleanField() #elimino (default=False)
    precio = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))]) #! agregar en forms
    cantidadDisp = models.IntegerField(validators=[MinValueValidator(0)])  
    imagen = models.ImageField(upload_to='productos/', null=True, blank=True)     
    idColeccion = models.ForeignKey(Coleccion, on_delete=models.CASCADE,related_name='productos')
    precio_original = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], null=True, blank=True)
    idEdicion = models.ForeignKey(Edicion, on_delete=models.CASCADE, related_name='productos', default=1)


    def clean(self):
        if Producto.objects.filter(idColeccion=self.idColeccion, numero=self.numero).exclude(idProducto=self.idProducto).exists():
            raise ValidationError({'numero': 'Ya existe un producto con este número en la misma colección.'})

        super().clean()

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre

#que se aplique la promocion al precio del producto y cuando termine la promocion vuelva al precio original
#Que no haya mas de 2 promociones activas al mismo producto al mismo tiempo
class Promocion(models.Model):
    id_promocion = models.AutoField(primary_key=True)
    porcentaje = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(Decimal('0.01')), MaxValueValidator(Decimal('1.00'))])
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    id_producto = models.ForeignKey('Producto', on_delete=models.CASCADE)

    def aplicar_promocion(self):
        producto = self.id_producto
        if producto.precio_original is None:
            producto.precio_original = producto.precio  # Guardar el precio original antes de aplicar la promoción
            producto.save()

        descuento = producto.precio * self.porcentaje
        producto.precio -= descuento  # Reducir el precio según el porcentaje de descuento
        producto.save()

    def quitar_descuento(self):
        producto = self.id_producto
        if producto.precio_original is not None:
            producto.precio = producto.precio_original  # Restaurar el precio original
            producto.precio_original = None  # Borrar el precio original
            producto.save()

    def clean(self):
        # Validación para no permitir más de dos promociones activas al mismo producto
        promociones_activas = Promocion.objects.filter(
            id_producto=self.id_producto,
            fecha_fin__gte=self.fecha_inicio,
            fecha_inicio__lte=self.fecha_fin,
        ).exclude(id_promocion=self.id_promocion)
        if promociones_activas.count() >= 2:  #!Quitar el =
            raise ValidationError("No puede haber más de dos promociones activas al mismo tiempo para el mismo producto.")

    def save(self, *args, **kwargs):
        # Asegúrate de llamar a clean() antes de guardar
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Promocion {self.id_promocion} - {self.porcentaje}%'

#Actualizar stock de producto ingresado
class IngresoStock(models.Model):
    idStock = models.AutoField(primary_key=True)
    cantidadIngresa = models.IntegerField( validators=[MinValueValidator(1)])
    idProducto = models.ForeignKey(Producto, on_delete=models.CASCADE)

    def __str__(self):
        return f'Ingreso de stock {self.idStock} - {self.cantidadIngresa}'


class PeticionProducto(models.Model):
    id_peticion = models.AutoField(primary_key=True)
    peticion = models.TextField(max_length=500)
    correo = models.EmailField(max_length=255)
    telefono = models.CharField(max_length=15)
    fechapedido = models.DateField()
    id_Usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE)

    def clean(self):
        if self.fechapedido <= timezone.now().date():
            raise ValidationError("La fecha del pedido debe ser posterior a la fecha actual.")
        
        super().clean()

#Al poner una reseña y comentario se tiene que verificar si el usuario compro el producto y si no hizo ya una reseña
#Para ese producto
class ResenaComentario(models.Model): #!CRUD
    idResenaComentario = models.AutoField(primary_key=True)
    resena = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comentario = models.CharField(max_length=500)
    idUsuario = models.ForeignKey('Usuario', on_delete=models.CASCADE)
    idProducto = models.ForeignKey('Producto', on_delete=models.CASCADE)

    def clean(self):
        if not Factura.objects.filter(
            lineas_factura__id_producto=self.id_producto,
            idUsuario=self.idUsuario
        ).exists():
            raise ValidationError(
                {'id_producto': 'No puedes reseñar un producto que no compraste.'}
            )

        if ResenaComentario.objects.filter(
            idProducto=self.idProducto,
            idUsuario=self.idUsuario
        ).exclude(idResenaComentario=self.idResenaComentario).exists():
            raise ValidationError(
                {'id_producto': 'Ya has hecho una reseña para este producto.'}
            )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Reseña {self.idResenaComentario} - {self.resena}'


class Pregunta(models.Model): #!CRUD
    id_pregunta = models.AutoField(primary_key=True)
    pregunta = models.TextField(max_length=255)
    respuesta = models.TextField(max_length=255, null=True)
    id_producto = models.ForeignKey('Producto', on_delete=models.CASCADE)
    id_Usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE)

    def __str__(self):
        return f'Pregunta {self.id_pregunta} - {self.pregunta}'

class CarritoDescuento(models.Model): 
    idCarritoDescuento = models.AutoField(primary_key=True)
    idCarrito = models.ForeignKey('Carrito', on_delete=models.CASCADE)
    idDescuento = models.ForeignKey('Descuento', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('idCarrito', 'idDescuento')

    def clean(self):
        if CarritoDescuento.objects.filter(idCarrito=self.idCarrito).exclude(idDescuento=self.idDescuento).exists():
            raise ValidationError({'idCarrito': 'El usuario ya tiene un descuento aplicado a su carrito.'})
        super().clean()


    def __str__(self):
        return f'CarritoDescuento {self.idCarritoDescuento} - {self.idCarrito} - {self.idDescuento}'

#generar total en al factura
class Factura(models.Model):
    id_factura = models.AutoField(primary_key=True)
    pago_total = models.DecimalField(max_digits=10, decimal_places=2,validators=[MinValueValidator(0)])
    forma_pago = models.CharField(max_length=50) #!INUTIL
    fecha_venta = models.DateField(auto_now_add=True)
    id_Usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE)

    def calcular_total(self): #!cambiar precio porm el precio unitario de linea factura
        lineas_factura = LineaFactura.objects.filter(id_factura=self)
        total = sum(linea.cantidad * linea.precioUnitario for linea in lineas_factura)
        return total

    def save(self, *args, **kwargs):
        self.pago_total = self.calcular_total()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Factura {self.id_factura} - {self.fecha_venta}'

class LineaFactura(models.Model):
    idLineaFactura = models.AutoField(primary_key=True)
    cantidad = models.IntegerField(validators=[MinValueValidator(1)])
    precioUnitario = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], default=0.00)
    idProducto = models.ForeignKey('Producto', on_delete=models.CASCADE)    
    id_factura = models.ForeignKey('Factura', on_delete=models.CASCADE, related_name='lineas_factura')

    def __str__(self):
        return f'LineaFactura {self.idLineaFactura} - {self.cantidad}'

class FacturaDescuento(models.Model):
    idFacturaDescuento = models.AutoField(primary_key=True)
    idDescuento = models.ForeignKey('Descuento', on_delete=models.CASCADE)
    id_factura = models.ForeignKey('Factura', on_delete=models.CASCADE)

    def __str__(self):
        return f'FacturaDescuento {self.idFacturaDescuento} - {self.idDescuento} - {self.id_factura}'

class ProductoCarrito(models.Model):
    id_producto_carrito = models.AutoField(primary_key=True)
    cantidad = models.IntegerField(validators=[MinValueValidator(1)])
    precioUnitario = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], default=0.00)
    id_producto = models.ForeignKey('Producto', on_delete=models.CASCADE)
    id_carrito = models.ForeignKey('Carrito', on_delete=models.CASCADE)

    def clean(self):
        if ProductoCarrito.objects.filter(
            id_producto=self.id_producto,
            id_carrito=self.id_carrito
        ).exclude(id_producto_carrito=self.id_producto_carrito).exists():
            raise ValidationError(
                {'id_producto': 'El producto ya está en ese carrito.'}
            )
        super().clean()

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


    def __str__(self):
        return f'Producto Carrito {self.id_producto_carrito} - {self.cantidad} x {self.id_producto.precio}'

class CodigoSeguimiento(models.Model): #?CRUD despues vemos
    codigo = models.CharField(max_length=50, unique=True)
    id_factura = models.ForeignKey('Factura', on_delete=models.CASCADE)

    def __str__(self):
        return f'Codigo Seguimiento {self.codigo} - {self.id_factura}'

class Venta(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='ventas')
    fecha_venta = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    descuento = models.ForeignKey('Descuento', on_delete=models.SET_NULL, null=True, blank=True)
    estado = models.CharField(max_length=20, choices=[
        ('pendiente', 'Pendiente'),
        ('pagado', 'Pagado'),
        ('cancelado', 'Cancelado'),
    ], default='pendiente')
    payment_id = models.CharField(max_length=100, null=True, blank=True)  # Nuevo campo para payment_id

    def aplicar_descuento(self):
        """Aplica el descuento al total de la venta si es aplicable."""
        if self.descuento:
            descuento = (self.total * self.descuento.porcentaje) / 100
            self.total -= descuento
            self.save()

    def __str__(self):
        return f"Venta {self.id} - {self.usuario.correo} - {self.fecha_venta}"
class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey('Producto', on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        """Calcula el total por producto antes de guardar."""
        self.total = self.precio_unitario * self.cantidad
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.producto.nombre} - Cantidad: {self.cantidad}"