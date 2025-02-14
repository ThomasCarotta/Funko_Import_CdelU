from rest_framework import serializers
from .models import (
    Usuario, Coleccion, carrito, Descuento, Producto, Promocion, IngresoStock, 
    PeticionProducto, ResenaComentario, Pregunta, CarritoDescuento, Factura, 
    LineaFactura, FacturaDescuento, ProductoCarrito, CodigoSeguimiento
)

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class ColeccionSerializer(serializers.ModelSerializer):
    cantidad = serializers.ReadOnlyField()
    class Meta:
        model = Coleccion
        fields = ['idColeccion', 'nombre', 'cantidad']

    cantidad = serializers.ReadOnlyField()

class CarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = carrito
        fields = '__all__'

class DescuentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Descuento
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'
        read_only_fields = ('id',)

class PromocionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promocion
        fields = '__all__'

class IngresoStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = IngresoStock
        fields = '__all__'

class PeticionProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PeticionProducto
        fields = '__all__'

class ResenaComentarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResenaComentario
        fields = '__all__'

class PreguntaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pregunta
        fields = '__all__'

class CarritoDescuentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarritoDescuento
        fields = '__all__'

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = '__all__'

class LineaFacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = LineaFactura
        fields = '__all__'

class FacturaDescuentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacturaDescuento
        fields = '__all__'

class ProductoCarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoCarrito
        fields = '__all__'

class CodigoSeguimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodigoSeguimiento
        fields = '__all__'