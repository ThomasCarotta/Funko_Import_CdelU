from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import Usuario, Coleccion, carrito, Descuento, Producto, Promocion, IngresoStock, ResenaComentario, Pregunta, CarritoDescuento, Factura, LineaFactura, ProductoCarrito, Edicion, Venta, DetalleVenta
from django.views.generic import CreateView, TemplateView
from .serializers import UsuarioSerializer, ColeccionSerializer, CarritoSerializer, DescuentoSerializer, ProductoSerializer, PromocionSerializer, IngresoStockSerializer, ResenaComentarioSerializer, PreguntaSerializer, FacturaSerializer, LineaFacturaSerializer, EdicionSerializer, VentaSerializer, DetallesSerializer
from django.urls import reverse_lazy
from rest_framework import viewsets
import mercadopago
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.parsers import MultiPartParser,FormParser
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from django.conf import settings
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from datetime import datetime
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.utils import timezone

# Create your views here.

#CRUDS
class UsuarioView(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    queryset = Usuario.objects.all()

class ColeccionView(viewsets.ModelViewSet): 
    serializer_class = ColeccionSerializer
    queryset = Coleccion.objects.all()

class EdicionView(viewsets.ModelViewSet):
    serializer_class = EdicionSerializer
    queryset = Edicion.objects.all()

class CarritoView(viewsets.ModelViewSet): 
    serializer_class = CarritoSerializer
    queryset = carrito.objects.all()

class DescuentoView(viewsets.ModelViewSet): 
    serializer_class = DescuentoSerializer
    queryset = Descuento.objects.all()

class ProductoView(viewsets.ModelViewSet): 
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = ProductoSerializer
    queryset = Producto.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PromocionView(viewsets.ModelViewSet):
    serializer_class = PromocionSerializer
    queryset = Promocion.objects.all().select_related('id_producto')
class resenaComentarioView(viewsets.ModelViewSet): 
    serializer_class = ResenaComentarioSerializer
    queryset = ResenaComentario.objects.all()

class preguntaView(viewsets.ModelViewSet):
    serializer_class = PreguntaSerializer
    queryset = Pregunta.objects.all()

class facturaView(viewsets.ModelViewSet):
    serializer_class = FacturaSerializer
    queryset = Factura.objects.all()

class lineaFacturaView(viewsets.ModelViewSet):
    serializer_class = LineaFacturaSerializer
    queryset = LineaFactura.objects.all()

class IngresoStockView(viewsets.ModelViewSet):
    serializer_class = IngresoStockSerializer
    queryset = IngresoStock.objects.all()

class VentaView(viewsets.ModelViewSet): 
    serializer_class = VentaSerializer
    queryset = Venta.objects.all()

class DetalleVentaView(viewsets.ModelViewSet): 
    serializer_class = DetallesSerializer
    queryset = DetalleVenta.objects.all()

#GET ALL

def getUsuarios(request):
    usuarios = Usuario.objects.all()
    serializer = UsuarioSerializer(usuarios, many=True)
    return JsonResponse(serializer.data, safe=False)

def getColecciones(request):
    colecciones = Coleccion.objects.all()
    serializer = ColeccionSerializer(colecciones, many=True)
    return JsonResponse(serializer.data, safe=False)

def getEdiciones(request):
    ediciones = Edicion.objects.all()
    serializer = EdicionSerializer(ediciones, many=True)
    return JsonResponse(serializer.data, safe=False)

def getCarritos(request):
    carritos = carrito.objects.all()
    serializer = CarritoSerializer(carritos, many=True)
    return JsonResponse(serializer.data, safe=False)

def getDescuentos(request):
    descuentos = Descuento.objects.all()
    serializer = DescuentoSerializer(descuentos, many=True)
    return JsonResponse(serializer.data, safe=False)

def getProductos(request):
    productos = Producto.objects.all()
    serializer = ProductoSerializer(productos, many=True)
    return JsonResponse(serializer.data, safe=False)

def getPromociones(request):
    promociones = Promocion.objects.all()
    serializer = PromocionSerializer(promociones, many=True)
    return JsonResponse(serializer.data, safe=False)

def getResenasComentarios(request):
    resenasComentarios = ResenaComentario.objects.all()
    serializer = ResenaComentarioSerializer(resenasComentarios, many=True)
    return JsonResponse(serializer.data, safe=False)

def getPreguntas(request):
    preguntas = Pregunta.objects.all()
    serializer = PreguntaSerializer(preguntas, many=True)
    return JsonResponse(serializer.data, safe=False)

def getFactura(request):
    facturas = Factura.objects.all()
    serializer = FacturaSerializer(facturas, many=True)
    return JsonResponse(serializer.data, safe=False)

def getLineaFactura(request):
    lineafacturas = LineaFactura.objects.all()
    serializer = LineaFacturaSerializer(lineafacturas, many=True)
    return JsonResponse(serializer.data, safe=False)

def getVenta(request):
    ventas = Venta.objects.all()
    serializer = VentaSerializer(ventas, many=True)
    return JsonResponse(serializer.data, safe=False)

def getDetalleVenta(request):
    detalleventas = DetalleVenta.objects.all()
    serializer = DetallesSerializer(detalleventas, many=True)
    return JsonResponse(serializer.data, safe=False)

#REST
def UsuariosRest (request):
    usuario=getUsuarios()
    return JsonResponse(usuario)

def ColeccionesRest (request):
    coleccion=getColecciones()
    return JsonResponse(coleccion)

def CarritosRest (request):
    carrito=getCarritos()
    return JsonResponse(carrito)

def DescuentosRest (request):
    descuento=getDescuentos()
    return JsonResponse(descuento)

def ProductosRest (request):
    producto=getProductos()
    return JsonResponse(producto)

def PromocionesRest (request):
    promocion=getPromociones()
    return JsonResponse(promocion)

def ResenasComentariosRest (request):
    resenaComentario=getResenasComentarios()
    return JsonResponse(resenaComentario)

def PreguntasRest (request):
    pregunta=getPreguntas()
    return JsonResponse(pregunta)

def edicionRest (request):
    edicion=getEdiciones()
    return JsonResponse(edicion)

def FacturaRest (request):
    factura=getFactura()
    return JsonResponse(factura)

def LineaFacturaRest (request):
    lineafactura=getFactura()
    return JsonResponse(lineafactura)

def VentaRest(request):
    ventas = getVenta(request)  
    return JsonResponse(ventas.content)  

def DetalleVentaRest(request):
    detalleventas = getDetalleVenta(request) 
    return JsonResponse(detalleventas.content) 

#MercadoPago
ACCESS_TOKEN = settings.ACCESS_TOKEN


#Login Google
GOOGLE_CLIENT_ID = "668894091180-c9dah2k5g4j3nbi4pneic550md1a2iok.apps.googleusercontent.com"
@csrf_exempt
def google_login(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        data = json.loads(request.body)
        token = data.get("token")

        if not token:
            return JsonResponse({"error": "Token no proporcionado"}, status=400)

        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)

        if idinfo["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
            return JsonResponse({"error": "Emisor no válido"}, status=403)

        email = idinfo["email"]
        nombre = idinfo.get("given_name", "")
        apellido = idinfo.get("family_name", "")

        usuario, created = Usuario.objects.get_or_create(
            correo=email,
            defaults={
                "nombre": nombre,
                "apellido": apellido,
                "direccion": "",
                "telefono": "",
                "rol": False
            }
        )

        es_admin = email == "funkoimportcdelu@gmail.com"
        if es_admin and not usuario.rol:
            usuario.rol = True
            usuario.save()

        user_data = {
            "email": usuario.correo,
            "nombre": usuario.nombre,
            "apellido": usuario.apellido,
            "rol": usuario.rol,
            "first_time": created,  # Indica si es un nuevo usuario
        }

        return JsonResponse({"message": "Autenticación exitosa", "user": user_data})

    except ValueError:
        return JsonResponse({"error": "Token inválido"}, status=403)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Formato JSON inválido"}, status=400)

@csrf_exempt
def completar_perfil(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("correo")
        nombre = data.get("nombre")
        apellido = data.get("apellido")
        direccion = data.get("direccion")
        telefono = data.get("telefono")

        if not all([email, nombre, apellido, direccion, telefono]):
            return JsonResponse({"error": "Faltan datos obligatorios"}, status=400)

        usuario = Usuario.objects.filter(correo=email).first()

        if not usuario:
            return JsonResponse({"error": "Usuario no encontrado"}, status=404)

        usuario.nombre = nombre
        usuario.apellido = apellido
        usuario.direccion = direccion
        usuario.telefono = telefono
        usuario.save()

        return JsonResponse({"message": "Perfil actualizado correctamente", "user": {
            "email": usuario.correo,
            "nombre": usuario.nombre,
            "apellido": usuario.apellido,
            "direccion": usuario.direccion,
            "telefono": usuario.telefono
        }})

    except json.JSONDecodeError:
        return JsonResponse({"error": "Formato JSON inválido"}, status=400)

@csrf_exempt
def user_data(request):
    if request.method != "GET":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    email = request.GET.get("email")
    if not email:
        return JsonResponse({"error": "Correo no proporcionado"}, status=400)

    usuario = Usuario.objects.filter(correo=email).first()
    if not usuario:
        return JsonResponse({"error": "Usuario no encontrado"}, status=404)

    user_data = {
        "nombre": usuario.nombre,
        "apellido": usuario.apellido,
        "correo": usuario.correo,
        "telefono": usuario.telefono,
        "direccion": usuario.direccion,
    }

    return JsonResponse({"user": user_data})

@csrf_exempt
def update_profile(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
        print("Datos recibidos en update_profile:", data)
        email = data.get("correo")
        nombre = data.get("nombre")
        apellido = data.get("apellido")
        telefono = data.get("telefono")
        direccion = data.get("direccion")

        usuario = Usuario.objects.filter(correo=email).first()
        if not usuario:
            return JsonResponse({"error": "Usuario no encontrado"}, status=404)

        if nombre:
            usuario.nombre = nombre
        if apellido:
            usuario.apellido = apellido
        if telefono:
            usuario.telefono = telefono
        if direccion:
            usuario.direccion = direccion

        usuario.save()

        return JsonResponse({"message": "Perfil actualizado correctamente"})

    except json.JSONDecodeError:
        return JsonResponse({"error": "Formato JSON inválido"}, status=400)

def admin_dashboard_data(request):
    ventas_totales = Factura.objects.aggregate(total_ventas=Sum('pago_total'))['total_ventas'] or 0
    productos_activos = Producto.objects.count()
    clientes_activos = Usuario.objects.count()

    # Obtener el producto más vendido
    producto_mas_vendido = LineaFactura.objects.values('idProducto__nombre') \
        .annotate(total_vendido=Sum('cantidad')) \
        .order_by('-total_vendido') \
        .first()

    return JsonResponse({
        'ventas_totales': ventas_totales,
        'productos_activos': productos_activos,
        'clientes_activos': clientes_activos,
        'producto_mas_vendido': producto_mas_vendido['idProducto__nombre'] if producto_mas_vendido else 'N/A'
    })

# def obtener_productos(request):
#     #obtiene la lista de productos de la base de datos
#     productos = Producto.objects.all().values(
#         "idProducto", 
#         "nombre", 
#         "numero", 
#         "idEdicion", 
#         "esEspecial", 
#         "descripcion", 
#         "brilla", 
#         "precio", 
#         "cantidadDisp", 
#         "imagen", 
#         "idColeccion", 
#         "precio_original"
#     )
    
#     productos_list = []
#     for producto in productos:
#         if producto["imagen"]:
#             producto["imagen"] = request.build_absolute_uri(settings.MEDIA_URL + producto["imagen"])
#         productos_list.append(producto)

#     return JsonResponse(productos_list, safe=False)


from datetime import date

fecha_actual = date.today()  # Esto también funciona

def obtener_productos(request):
    productos = Producto.objects.all().values(
        "idProducto", 
        "nombre", 
        "numero", 
        "idEdicion", 
        "esEspecial", 
        "descripcion", 
        "brilla", 
        "precio", 
        "cantidadDisp", 
        "imagen", 
        "idColeccion", 
        "precio_original"
    )
    
    productos_list = []
    for producto in productos:
        # Obtener la instancia de Producto
        try:
            producto_obj = Producto.objects.get(idProducto=producto["idProducto"])
        except Producto.DoesNotExist:
            continue  # Saltar si el producto no existe (prevención de errores)

        # Buscar promoción activa
        promocion_activa = Promocion.objects.filter(
            id_producto=producto_obj, 
            fecha_inicio__lte=date.today(), 
            fecha_fin__gte=date.today()
        ).order_by('-fecha_inicio').first()

        if promocion_activa:
            descuento = float(producto["precio"]) * float(promocion_activa.porcentaje)
            producto["precio_con_descuento"] = round(float(producto["precio"]) - descuento, 2)
            producto["porcentaje_descuento"] = int(promocion_activa.porcentaje * 100)
        else:
            producto["precio_con_descuento"] = None
            producto["porcentaje_descuento"] = None

        # Ajustar imagen si está presente
        if producto["imagen"]:
            producto["imagen"] = request.build_absolute_uri(settings.MEDIA_URL + producto["imagen"])
        
        productos_list.append(producto)

    return JsonResponse(productos_list, safe=False)

@api_view(['GET'])
def obtener_detalle_producto(request, idProducto):
    try:
        # Obtener el producto por su idProducto
        producto = get_object_or_404(Producto, idProducto=idProducto)
        
        # Buscar promoción activa
        promocion_activa = Promocion.objects.filter(
            id_producto=producto, 
            fecha_inicio__lte=date.today(), 
            fecha_fin__gte=date.today()
        ).order_by('-fecha_inicio').first()

        # Calcular precio con descuento si hay una promoción activa
        if promocion_activa:
            descuento = float(producto.precio) * float(promocion_activa.porcentaje)
            precio_con_descuento = round(float(producto.precio) - descuento, 2)
            porcentaje_descuento = int(promocion_activa.porcentaje * 100)
        else:
            precio_con_descuento = None
            porcentaje_descuento = None

        # Construir la URL de la imagen si está presente
        imagen_url = producto.imagen.url if producto.imagen else None

        # Devolver los datos del producto como una respuesta JSON
        return JsonResponse({
            "idProducto": producto.idProducto,
            "nombre": producto.nombre,
            "descripcion": producto.descripcion,
            "precio": str(producto.precio),  # Convertimos el precio a string para asegurar el formato correcto
            "precio_con_descuento": str(precio_con_descuento) if precio_con_descuento else None,
            "porcentaje_descuento": porcentaje_descuento,
            "imagen": imagen_url,
            "cantidadDisp": producto.cantidadDisp,
            "esEspecial": producto.esEspecial,
        })
    except Exception as e:
        # Si ocurre un error, lo devolvemos en formato JSON
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def add_to_cart(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            correo = data.get("correo")
            id_producto = data.get("idProducto")
            cantidad = data.get("cantidad")

            if not id_producto or not cantidad or not correo:
                return JsonResponse({"success": False, "message": "Datos incompletos"}, status=400)

            # Verificar si el usuario existe a partir del correo
            try:
                usuario = Usuario.objects.get(correo=correo)
            except Usuario.DoesNotExist:
                return JsonResponse({"success": False, "message": "Usuario no encontrado"}, status=404)

            # Verificar si el producto existe
            try:
                producto = Producto.objects.get(idProducto=id_producto)
            except Producto.DoesNotExist:
                return JsonResponse({"success": False, "message": "Producto no encontrado"}, status=404)

            # Buscar promoción activa para el producto
            promocion_activa = Promocion.objects.filter(
                id_producto=producto, 
                fecha_inicio__lte=date.today(), 
                fecha_fin__gte=date.today()
            ).order_by('-fecha_inicio').first()

            # Calcular el precio con descuento si hay una promoción activa
            precio_final = float(producto.precio)
            if promocion_activa:
                descuento = float(producto.precio) * float(promocion_activa.porcentaje)
                precio_final = round(float(producto.precio) - descuento, 2)

            # Obtener o crear el carrito del usuario
            carrito_usuario, created = carrito.objects.get_or_create(idUsuario=usuario)

            # Verificar si el producto ya está en el carrito
            producto_carrito, created = ProductoCarrito.objects.get_or_create(
                id_carrito=carrito_usuario, 
                id_producto=producto,
                defaults={"cantidad": cantidad, "precioUnitario": precio_final}
            )

            if not created:
                # Si el producto ya está en el carrito, actualizar cantidad y precio solo si hay una nueva promoción
                if promocion_activa and producto_carrito.precioUnitario != precio_final:
                    producto_carrito.precioUnitario = precio_final  # Actualizar precio con promoción activa
                producto_carrito.cantidad += cantidad
                producto_carrito.save()

            # Actualizar el total del carrito
            carrito_usuario.actualizar_total()
            print(f"✅ Total del carrito actualizado: {carrito_usuario.total}")

            return JsonResponse({"success": True, "message": "Producto añadido al carrito"})

        except Exception as e:
            print(f"❌ Error al agregar al carrito: {str(e)}")  # Imprimir más detalles sobre el error
            return JsonResponse({"success": False, "message": "Hubo un problema al agregar al carrito", "error": str(e)}, status=500)

    return JsonResponse({"success": False, "message": "Método no permitido"}, status=405)

@api_view(['GET'])
def obtener_carrito(request):
    userEmail = request.headers.get('userEmail')  # Obtener el correo desde los headers
    if not userEmail:
        return JsonResponse({"error": "Usuario no autenticado"}, status=401)

    try:
        # Obtener usuario por correo
        usuario = Usuario.objects.get(correo=userEmail)
        
        # Obtener el carrito del usuario (si existe)
        carrito_usuario = carrito.objects.filter(idUsuario=usuario).first()
        if not carrito_usuario:
            return JsonResponse({"error": "Carrito no encontrado"}, status=404)

        # Obtener los productos del carrito
        productos_carrito = ProductoCarrito.objects.filter(id_carrito=carrito_usuario)

        productos = [{
            "idProducto": item.id_producto.idProducto,
            "nombre": item.id_producto.nombre,
            "cantidad": item.cantidad,
            "precio": float(item.id_producto.precio),
            "imagen": item.id_producto.imagen.url,
        } for item in productos_carrito]

        return JsonResponse({
            "idCarrito": carrito_usuario.idCarrito,
            "total": float(carrito_usuario.total),
            "productos": productos,
        })

    except Usuario.DoesNotExist:
        return JsonResponse({"error": "Usuario no encontrado"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def actualizar_cantidad(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_token = data.get("user_token")
            id_producto = data.get("idProducto")
            nueva_cantidad = data.get("cantidad")

            if not user_token or not id_producto or not nueva_cantidad:
                return JsonResponse({"success": False, "message": "Datos incompletos"}, status=400)

            # Obtener usuario por token
            try:
                usuario = Usuario.objects.get(token=user_token)
            except Usuario.DoesNotExist:
                return JsonResponse({"success": False, "message": "Usuario no encontrado"}, status=404)

            # Obtener producto
            try:
                producto = Producto.objects.get(idProducto=id_producto)
            except Producto.DoesNotExist:
                return JsonResponse({"success": False, "message": "Producto no encontrado"}, status=404)

            # Obtener carrito del usuario
            carrito_usuario = carrito.objects.get(idUsuario=usuario)

            # Verificar si el producto está en el carrito
            producto_carrito = ProductoCarrito.objects.filter(carrito=carrito_usuario, producto=producto).first()
            if not producto_carrito:
                return JsonResponse({"success": False, "message": "Producto no está en el carrito"}, status=404)

            # Actualizar la cantidad
            producto_carrito.cantidad = nueva_cantidad
            producto_carrito.save()

            # Actualizar el total del carrito
            carrito_usuario.actualizar_total()

            return JsonResponse({"success": True, "message": "Cantidad actualizada en el carrito"})

        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
 
@csrf_exempt
def aplicar_descuento(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            codigo_descuento = data.get("codigoDescuento")
            user_email = data.get("userEmail")

            if not codigo_descuento or not user_email:
                return JsonResponse({"success": False, "message": "Datos incompletos"}, status=400)

            # Buscar el usuario por su email
            usuario = Usuario.objects.get(correo=user_email)
            # Buscar el carrito asociado a ese usuario
            carrito_usuario = carrito.objects.get(idUsuario=usuario)

            # Buscar el descuento por su código
            try:
                descuento = Descuento.objects.get(codigoDescuento=codigo_descuento)
            except Descuento.DoesNotExist:
                return JsonResponse({"success": False, "message": "Código de descuento no válido"}, status=404)

            # Verificar si el descuento ya fue aplicado al carrito
            if CarritoDescuento.objects.filter(idCarrito=carrito_usuario, idDescuento=descuento).exists():
                return JsonResponse({"success": False, "message": "El descuento ya fue aplicado a este carrito"}, status=400)

            # Verificar si la fecha de validez del descuento es correcta
            if descuento.fechaInicio <= datetime.date.today() <= descuento.fechaFin:
                # Calcular el nuevo total con el descuento aplicado
                subtotal = carrito_usuario.calcular_total()
                nuevo_total = subtotal * (1 - descuento.porcentaje)
                carrito_usuario.total = nuevo_total
                carrito_usuario.save()

                # Registrar el descuento en la tabla CarritoDescuento
                CarritoDescuento.objects.create(idCarrito=carrito_usuario, idDescuento=descuento)

                return JsonResponse({
                    "success": True,
                    "message": "Descuento aplicado",
                    "descuento": str(descuento.porcentaje * 100),  # Mostrar el porcentaje como entero
                    "newTotal": str(nuevo_total),
                })
            else:
                return JsonResponse({"success": False, "message": "Código de descuento expirado"}, status=400)

        except Usuario.DoesNotExist:
            return JsonResponse({"success": False, "message": "Usuario no encontrado"}, status=404)
        except carrito.DoesNotExist:
            return JsonResponse({"success": False, "message": "Carrito no encontrado"}, status=404)
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)


@api_view(['DELETE'])
def eliminar_producto_carrito(request):
    user_email = request.GET.get('userEmail')
    id_producto = request.GET.get('idProducto')

    if not user_email or not id_producto:
        return Response({"error": "Faltan parámetros"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Buscar el usuario por su correo (no email)
        usuario = Usuario.objects.get(correo=user_email)
        # Buscar el carrito asociado a ese usuario
        carrito_usuario = carrito.objects.get(idUsuario=usuario)
    except Usuario.DoesNotExist:
        return Response({"error": "El usuario no existe"}, status=status.HTTP_404_NOT_FOUND)
    except carrito.DoesNotExist:
        return Response({"error": "El carrito no existe"}, status=status.HTTP_404_NOT_FOUND)

    try:
        producto = Producto.objects.get(idProducto=id_producto)
    except Producto.DoesNotExist:
        return Response({"error": "El producto no existe"}, status=status.HTTP_404_NOT_FOUND)

    # Buscar el producto en la tabla intermedia ProductoCarrito
    producto_en_carrito = ProductoCarrito.objects.filter(id_carrito=carrito_usuario, id_producto=producto).first()
    
    if producto_en_carrito:
        producto_en_carrito.delete()  # Eliminar el producto del carrito
        carrito_usuario.actualizar_total()  # Actualiza el total después de eliminar
        return Response({"message": "Producto eliminado del carrito"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Producto no encontrado en el carrito"}, status=status.HTTP_404_NOT_FOUND)


#preguntas

@api_view(['GET'])
def obtener_preguntas_producto(request, idProducto):
    try:
        preguntas = Pregunta.objects.filter(id_producto=idProducto).select_related('id_Usuario')
        preguntas_data = []
        for pregunta in preguntas:
            preguntas_data.append({
                "id_pregunta": pregunta.id_pregunta,
                "pregunta": pregunta.pregunta,
                "respuesta": pregunta.respuesta,
                "id_Usuario": {
                    "nombre": pregunta.id_Usuario.nombre,
                    "correo": pregunta.id_Usuario.correo
                }
            })
        return JsonResponse(preguntas_data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

@csrf_exempt
def crear_pregunta(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            pregunta_texto = data.get("pregunta")
            id_producto = data.get("id_producto")
            correo = data.get("correo")

            if not pregunta_texto or not id_producto or not correo:
                return JsonResponse({"success": False, "message": "Datos incompletos"}, status=400)

            # Verificar si el usuario existe
            try:
                usuario = Usuario.objects.get(correo=correo)
            except Usuario.DoesNotExist:
                return JsonResponse({"success": False, "message": "Usuario no encontrado"}, status=404)

            # Verificar si el producto existe
            try:
                producto = Producto.objects.get(idProducto=id_producto)
            except Producto.DoesNotExist:
                return JsonResponse({"success": False, "message": "Producto no encontrado"}, status=404)

            # Crear la pregunta
            pregunta = Pregunta.objects.create(
                pregunta=pregunta_texto,
                id_producto=producto,
                id_Usuario=usuario
            )

            return JsonResponse({
                "success": True,
                "message": "Pregunta creada correctamente",
                "pregunta": {
                    "id_pregunta": pregunta.id_pregunta,
                    "pregunta": pregunta.pregunta,
                    "respuesta": pregunta.respuesta,
                    "id_Usuario": {
                        "nombre": usuario.nombre,
                        "correo": usuario.correo
                    }
                }
            })

        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)

    return JsonResponse({"success": False, "message": "Método no permitido"}, status=405)

@csrf_exempt
def responder_pregunta(request, idPregunta):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            respuesta_texto = data.get("respuesta")

            if not respuesta_texto:
                return JsonResponse({"success": False, "message": "Respuesta no proporcionada"}, status=400)

            # Verificar si la pregunta existe
            try:
                pregunta = Pregunta.objects.get(id_pregunta=idPregunta)
            except Pregunta.DoesNotExist:
                return JsonResponse({"success": False, "message": "Pregunta no encontrada"}, status=404)

            # Actualizar la pregunta con la respuesta
            pregunta.respuesta = respuesta_texto
            pregunta.save()

            return JsonResponse({
                "success": True,
                "message": "Respuesta enviada correctamente",
                "pregunta": {
                    "id_pregunta": pregunta.id_pregunta,
                    "pregunta": pregunta.pregunta,
                    "respuesta": pregunta.respuesta,
                    "id_Usuario": {
                        "nombre": pregunta.id_Usuario.nombre,
                        "correo": pregunta.id_Usuario.correo
                    }
                }
            })

        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)

    return JsonResponse({"success": False, "message": "Método no permitido"}, status=405)

@csrf_exempt
def create_payment_preference(request):
    if request.method == 'POST':
        try:
            # Parsear el cuerpo de la solicitud
            data = json.loads(request.body)
            total = data.get('total')
            items = data.get('items')
            userEmail = data.get('payer', {}).get('email')

            # Validar que los datos requeridos estén presentes
            if not total or not items or not userEmail:
                return JsonResponse({"error": "Faltan datos requeridos"}, status=400)

            # Inicializar el SDK de Mercado Pago
            sdk = mercadopago.SDK(ACCESS_TOKEN)

            # Crear la preferencia de pago
            preference_data = {
                "items": items,
                "payer": {
                    "email": userEmail,
                },
                "back_urls": {
                    "success": "http://localhost:5173/user/success",
                    "failure": "http://localhost:5173/user/failure",
                    "pending": "http://localhost:5173/user/pending",
                },
                "auto_return": "approved",
            }

            preference_response = sdk.preference().create(preference_data)
            
            # Verificar si la preferencia se creó correctamente
            if "response" not in preference_response:
                return JsonResponse({"error": "Error al crear la preferencia de pago"}, status=500)
            
            preference = preference_response["response"]

            return JsonResponse({"preferenceId": preference["id"]})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Formato JSON inválido"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Método no permitido, use POST"}, status=405)

import requests  # Asegúrate de importar la librería

@csrf_exempt
def payment_success(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            payment_id = data.get("payment_id")
            userEmail = data.get("payer", {}).get("email")
            total = data.get("total")
            items = data.get("items", [])

            if not payment_id or not userEmail or not total or not items:
                return JsonResponse({"error": "Datos incompletos"}, status=400)

            # Verificar el pago con Mercado Pago
            headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
            mp_response = requests.get(f"https://api.mercadopago.com/v1/payments/{payment_id}", headers=headers)

            if mp_response.status_code != 200:
                return JsonResponse({"error": "Error al verificar el pago con Mercado Pago"}, status=400)

            mp_data = mp_response.json()

            if mp_data.get("status") != "approved":
                return JsonResponse({"error": "Pago no aprobado"}, status=400)

            # ✅ 2. Buscar usuario por correo
            user = Usuario.objects.filter(correo=userEmail).first()
            if not user:
                return JsonResponse({"error": "Usuario no encontrado"}, status=404)

            # ✅ 3. Registrar la venta
            venta = Venta.objects.create(
                usuario=user,
                total=total,
                payment_id=payment_id,  # Ahora puedes usar payment_id
                estado='pagado'  # Establecer el estado como 'pagado'
            )

            # ✅ 4. Registrar los detalles de la venta
            for item in items:
                producto = Producto.objects.filter(idProducto=item["idProducto"]).first()
                if producto and producto.cantidadDisp >= item["quantity"]:
                    producto.cantidadDisp -= item["quantity"]
                    producto.save()

                    # Crear el detalle de la venta
                    DetalleVenta.objects.create(
                        venta=venta,
                        producto=producto,
                        cantidad=item["quantity"],
                        precio_unitario=item["unit_price"],
                        total=item["unit_price"] * item["quantity"]
                    )
                else:
                    # Revertir la venta si no hay suficiente stock
                    venta.delete()
                    return JsonResponse({"error": f"Stock insuficiente para {producto.nombre}"}, status=400)

            return JsonResponse({"message": "Compra registrada con éxito"})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Formato JSON inválido"}, status=400)
        except Exception as e:
            print("Error en payment_success:", str(e))  # Depuración
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Método no permitido"}, status=405)

# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from .models import Venta, DetalleVenta

@api_view(['GET'])
def get_ventas(request):
    admin = request.query_params.get('admin')  # Nuevo parámetro para verificar si es admin
    user_email = request.query_params.get('email')

    if not admin:  # Si no es admin, debe filtrar por usuario
        if not user_email:
            return Response({"error": "Correo electrónico no proporcionado"}, status=400)

        try:
            usuario = Usuario.objects.get(correo=user_email)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)

        ventas = Venta.objects.filter(usuario=usuario)
    else:
        ventas = Venta.objects.all()  # Si es admin, obtiene todas las ventas

    ventas_con_productos = []
    for venta in ventas:
        detalles = DetalleVenta.objects.filter(venta=venta)
        productos = []
        for detalle in detalles:
            productos.append({
                'id': detalle.producto.idProducto,
                'nombre': detalle.producto.nombre,
                'cantidad': detalle.cantidad,
                'precio_unitario': detalle.precio_unitario,
                'total': detalle.total,
            })
        ventas_con_productos.append({
            'id': venta.id,
            'usuario': venta.usuario.correo,  # Muestra el usuario en la vista de admin
            'fecha_venta': venta.fecha_venta,
            'total': venta.total,
            'productos': productos,
        })

    return Response(ventas_con_productos)
