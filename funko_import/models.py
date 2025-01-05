from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone

#hola

import string
import random

# Obtener nombre y apellido concatenados
class Usuario(models.Model):  #!CRUD 
    idUsuario= models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    direccion = models.CharField(max_length=255)
    correo = models.EmailField()
    telefono = models.CharField(max_length=15)
    rol = models.BooleanField(default=False)
    
    def __str__(self):
        return f'{self.idUsuario} - {self.nombre}'

#! Que no haya mas de 2 colecciones con el mismo nombre
class Coleccion(models.Model):
    idColeccion = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=100, unique=True) 

    def clean(self):
        super().clean()
        if Coleccion.objects.exclude(idColeccion=self.idColeccion).filter(nombre=self.nombre).exists():
            raise ValidationError({'nombre': 'Ya existe una colección con este nombre.'})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre
 

#!calcular el total del carrito
#!que no haya mas de 2 carritos con el mismo usuario
class carrito(models.Model): #!CRUD
    idCarrito = models.BigAutoField(primary_key=True)
    total = models.FloatField(validators=[MinValueValidator(0)])
    idUsuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    def calcular_total(self):
        productos_carrito = ProductoCarrito.objects.filter(id_carrito=self)
        total = 0
        for producto_carrito in productos_carrito:
            total += producto_carrito.cantidad * producto_carrito.id_producto.precio
        return total
    
    def aplicar_descuento(self, porcentaje):
        self.total = self.calcular_total() * (1 - porcentaje)
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

#?Generar automaricamente codigos de descuento
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
        if Coleccion.objects.exclude(idDescuento=self.idDescuento).filter(codigoDescuento=self.codigoDescuento).exists():
            raise ValidationError({'nombre': 'Ya existe este codigo de descuento.'})

    def generar_codigo(self):
        longitud_codigo = 10  # Longitud del código
        caracteres = string.ascii_uppercase + string.digits
        while True:
            nuevo_codigo = ''.join(random.choices(caracteres, k=longitud_codigo))
            if not Descuento.objects.filter(codigoDescuento=nuevo_codigo).exists():
                return nuevo_codigo

    def save(self, *args, **kwargs):
        self.codigoDescuento = self.generar_codigo()
        super().save(*args, **kwargs)
    
 #!que 2 productos no tengan el mismo numero si pertenecen a la misma coleccion
 #reducir stock al hacer compra
class Producto(models.Model): #!CRUD
    idProducto = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    numero = models.IntegerField(validators=[MinValueValidator(1)])
    nombreEdicion = models.CharField(max_length=100, null=True)
    esEspecial = models.BooleanField(default=False)
    descripcion = models.CharField(max_length=255)
    brilla = models.BooleanField(default=False)
    precio = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)]) #! agregar en forms
    cantidadDisp = models.IntegerField(validators=[MinValueValidator(0)])  
    URLImagen = models.CharField(max_length=2083)
    idColeccion = models.ForeignKey(Coleccion, on_delete=models.CASCADE)

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
class Promocion(models.Model): #!CRUD
    id_promocion = models.AutoField(primary_key=True)
    porcentaje = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(1)]) #! agregar en forms
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField() 
    id_producto = models.ForeignKey('Producto', on_delete=models.CASCADE)
    
    def clean(self):
        # Busca las promociones activas para el mismo producto
        promociones_activas = Promocion.objects.filter(
            idProducto=self.idProducto,
            fechaFin__gte=self.fechaInicio,  # Las promociones que terminan después de que esta inicia
            fechaInicio__lte=self.fechaFin,  # Las promociones que inician antes de que esta termina
        ).exclude(id=self.id)  # Excluir la promoción actual (en caso de actualización)

        if promociones_activas.count() >= 2:
            raise ValidationError(
                f"No se pueden asociar más de dos promociones activas al producto {self.idProducto.nombre} al mismo tiempo."
            )

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
    fecha_venta = models.DateField()
    id_Usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE)

    def calcular_total(self):
        lineas_factura = LineaFactura.objects.filter(id_factura=self)
        total = sum(linea.cantidad * linea.idProducto.precio for linea in lineas_factura)
        return total

    def save(self, *args, **kwargs):
        self.pago_total = self.calcular_total()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Factura {self.id_factura} - {self.fecha_venta}'

class LineaFactura(models.Model):
    idLineaFactura = models.AutoField(primary_key=True)
    cantidad = models.IntegerField(validators=[MinValueValidator(1)])
    idProducto = models.ForeignKey('Producto', on_delete=models.CASCADE)    
    id_factura = models.ForeignKey('Factura', on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if self.idProducto.cantidadDisp < self.cantidad:
            raise ValidationError(f"No hay suficiente stock disponible para el producto {self.idProducto.nombre}.")
        
        self.idProducto.cantidadDisp -= self.cantidad
        self.idProducto.save()
        
        super().save(*args, **kwargs)

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
        return f'Producto Carrito {self.id_producto_carrito} - {self.cantidad} x {self.precio}'

class CodigoSeguimiento(models.Model): #?CRUD despues vemos
    codigo = models.CharField(max_length=50, unique=True)
    id_factura = models.ForeignKey('Factura', on_delete=models.CASCADE)

    def __str__(self):
        return f'Codigo Seguimiento {self.codigo} - {self.id_factura}'


