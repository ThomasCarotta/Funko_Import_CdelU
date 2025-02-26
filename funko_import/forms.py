from django import forms
from .models import Usuario, Coleccion, Descuento, Producto, Promocion, IngresoStock, PeticionProducto, ResenaComentario, Pregunta, Factura, LineaFactura,carrito,Venta 
from django.core.exceptions import ValidationError
from datetime import datetime

class UsuarioForm(forms.ModelForm):
    class Meta:
        model = Usuario
        fields = ['nombre', 'apellido', 'telefono', 'correo', 'direccion']

class ColeccionForm(forms.ModelForm):
    class Meta:
        model = Coleccion
        fields = ['nombre']

class carritoForm(forms.ModelForm):
    class Meta:
        model = carrito
        fields = '__all__'

class EdicionForm(forms.ModelForm):
    class Meta:
        model = Coleccion
        fields = ['nombre']  

class DescuentoForm(forms.ModelForm):
    class Meta:
        model = Descuento
        fields = ['codigoDescuento', 'fechaInicio', 'fechaFin', 'porcentaje']
        widgets = { 
            'fechaInicio': forms.DateInput(attrs={'type': 'date'}),
            'fechaFin': forms.DateInput(attrs={'type': 'date'}),
            }
    
        def save(self, commit=True, *args, **kwargs): #! para intentar el generar codigo en el /admin pero no funca
            if not self.instance.codigoDescuento:
                self.instance.codigoDescuento = self.instance.generar_codigo()
            return super().save(commit=commit, *args, **kwargs)
        
    def clean(self):
        cleaned_data = super().clean()
        fecha_inicio = cleaned_data.get('fecha_inicio')
        fecha_fin = cleaned_data.get('fecha_fin')
        porcentaje = cleaned_data.get('porcentaje')

        if fecha_inicio and fecha_fin: 
            if fecha_inicio > fecha_fin:
                raise ValidationError('La fecha de inicio no puede ser mayor que la fecha de fin.') #hacer procedimiento porque se repite en promocion
            elif fecha_inicio < datetime.now().date():
                raise ValidationError('La fecha de inicio no puede ser menor a la fecha actual.')
            elif fecha_fin < datetime.now().date():
                raise ValidationError('La fecha de fin no puede ser menor a la fecha actual.')

        if porcentaje is not None:  
            if porcentaje < 0 or porcentaje > 1:
                raise ValidationError('El porcentaje debe estar entre 0 y 1.')
        return cleaned_data
    

class productoForm(forms.ModelForm):
    class Meta:
        model = Producto
        fields = ['nombre','numero','esEspecial','descripcion','brilla','precio','cantidadDisp','imagen','idColeccion']
        widgets = {
            'idColeccion': forms.Select(attrs={'class': 'form-control'}),
            }
    
    def clean(self):
        cleaned_data = super().clean()
        cantidad_disp = cleaned_data.get('cantidadDisp')

        if cantidad_disp is not None:
            if cantidad_disp < 0:
                raise ValidationError('La cantidad disponible debe ser mayor o igual a 0.')

        return cleaned_data
class promocionForm(forms.ModelForm):
    class Meta:
        model = Promocion
        fields = [ 'porcentaje', 'fecha_inicio','fecha_fin','id_producto']
        widgets = {
            'id_producto': forms.Select(attrs={'class': 'form-control'}),
            'fecha_inicio': forms.DateInput(attrs={'type': 'date'}),
            'fecha_fin': forms.DateInput(attrs={'type': 'date'}),
            }

    def clean(self):
        cleaned_data = super().clean()
        fecha_inicio = cleaned_data.get('fecha_inicio')
        fecha_fin = cleaned_data.get('fecha_fin')
        porcentaje = cleaned_data.get('porcentaje')

        if fecha_inicio and fecha_fin:
            if fecha_inicio > fecha_fin:
                raise ValidationError('La fecha de inicio no puede ser mayor que la fecha de fin.')
            elif fecha_inicio < datetime.now().date():
                raise ValidationError('La fecha de inicio no puede ser menor a la fecha actual.')
            elif fecha_fin < datetime.now().date():
                raise ValidationError('La fecha de fin no puede ser menor a la fecha actual.')

        if porcentaje is not None:
            if porcentaje < 0 or porcentaje > 1:
                raise ValidationError('El porcentaje debe estar entre 0 y 1.')

        return cleaned_data
    
class IngresoStockForm(forms.ModelForm):
    class Meta:
        model = IngresoStock
        fields = [ 'cantidadIngresa', 'idProducto' ]
        widgets = { 
            'idProducto': forms.Select(attrs={'class': 'form-control'}),
            'cantidadIngresa': forms.NumberInput(attrs={'class': 'form-control'}),
            }
    def clean(self):
        
        cleaned_data = super().clean()
        cantidad = cleaned_data.get('cantidad')

        if cantidad is not None:
            if cantidad < 1:
                raise ValidationError('Para ingresar stock, la cantidad debe ser igual o mayor a 1.')

        return cleaned_data

class PeticionProductoForm(forms.ModelForm):
    class Meta:
        model = PeticionProducto
        fields = [ 'peticion', 'correo', 'telefono']

class ResenaComentarioForm(forms.ModelForm):
    class Meta:
        model = ResenaComentario
        fields = [ 'resena', 'comentario']

    
class PreguntaForm(forms.ModelForm):
    class Meta:
        model = Pregunta
        fields = ['pregunta']

class RespuestaForm(forms.ModelForm):
    class Meta:
        model = Pregunta
        fields = ['respuesta']

class FacturaForm(forms.ModelForm):
    class Meta:
        model = Factura
        fields = '__all__'  # O puedes especificar campos como ['cliente', 'fecha', 'total']
        widgets = {
            'fecha': forms.DateInput(attrs={'type': 'date'}),
        }

class LineaFacturaForm(forms.ModelForm):
    class Meta:
        model = LineaFactura
        fields = '__all__'  # O especificar campos como ['factura', 'producto', 'cantidad', 'precio']

    class ventaForm(forms.ModelForm):
        class Meta:
            model = Venta
            fields = '__all__'
        