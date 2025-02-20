from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import Usuario, Coleccion, carrito, Descuento, Producto, Promocion, IngresoStock, PeticionProducto, ResenaComentario, Pregunta, CarritoDescuento, Factura, LineaFactura, FacturaDescuento, ProductoCarrito, CodigoSeguimiento, Edicion
from django.views.generic import CreateView, TemplateView
from .serializers import UsuarioSerializer, ColeccionSerializer, CarritoSerializer, DescuentoSerializer, ProductoSerializer, PromocionSerializer, IngresoStockSerializer, PeticionProductoSerializer, ResenaComentarioSerializer, PreguntaSerializer, CarritoDescuentoSerializer, FacturaSerializer, LineaFacturaSerializer, FacturaDescuentoSerializer, ProductoCarritoSerializer, CodigoSeguimientoSerializer, EdicionSerializer
from .forms import UsuarioForm, ColeccionForm, DescuentoForm, productoForm, promocionForm, IngresoStockForm, PeticionProductoForm, ResenaComentarioForm, PreguntaForm, RespuestaForm
from django.urls import reverse_lazy
from rest_framework import viewsets
import mercadopago
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.parsers import MultiPartParser,FormParser,JSONParser
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, Count
from django.conf import settings

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

class PromocionView(viewsets.ModelViewSet):
    serializer_class = PromocionSerializer
    queryset = Promocion.objects.all()

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

#MercadoPago
# Credenciales de acceso (Access Token)
ACCESS_TOKEN = "token"

@csrf_exempt
def process_payment(request):
    if request.method == "POST":
        try:
            # Inicializar el SDK de Mercado Pago
            sdk = mercadopago.SDK(ACCESS_TOKEN)
            
            # Obtener los datos del cuerpo de la solicitud
            body = json.loads(request.body)

            # Crear el pago
            payment_data = {
                "transaction_amount": float(body["transaction_amount"]),
                "token": body["token"],
                "description": body["description"],
                "installments": int(body["installments"]),
                "payment_method_id": body["payment_method_id"],
                "payer": {
                    "email": body["payer"]["email"]
                }
            }

            # Procesar el pago
            payment_response = sdk.payment().create(payment_data)
            payment = payment_response["response"]

            # Retornar la respuesta del pago al cliente
            return JsonResponse({
                "status": payment.get("status"),
                "status_detail": payment.get("status_detail"),
                "id": payment.get("id"),
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=400)

#Login Google

from django.http import JsonResponse
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

# CLIENT_ID de tu aplicación en Google Cloud

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .models import Usuario


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

#@csrf_exempt  # Para permitir peticiones sin CSRF Token (solo en desarrollo)
#permite que los usuarios completen su información personal en la base de datos después de registrarse con Google
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
        # "ciudad": usuario.ciudad,
        # "provincia": usuario.provincia,
        # "codigoPostal": usuario.codigoPostal,
    }

    return JsonResponse({"user": user_data})

@csrf_exempt
def update_profile(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))  # Asegurar decodificación correcta
        print("Datos recibidos en update_profile:", data)  # Ver qué llega realmente
        email = data.get("correo")
        nombre = data.get("nombre")
        apellido = data.get("apellido")
        telefono = data.get("telefono")
        direccion = data.get("direccion")
        # ciudad = data.get("ciudad")
        # provincia = data.get("provincia")
        # codigoPostal = data.get("codigoPostal")

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
        # if ciudad:
        #     usuario.ciudad = ciudad
        # if provincia:
        #     usuario.provincia = provincia
        # if codigoPostal:
        #     usuario.codigoPostal = codigoPostal

        usuario.save()

        return JsonResponse({"message": "Perfil actualizado correctamente"})

    except json.JSONDecodeError:
        return JsonResponse({"error": "Formato JSON inválido"}, status=400)

from django.db.models import Sum, Count

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

from django.conf import settings


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
        if producto["imagen"]:
            producto["imagen"] = request.build_absolute_uri(settings.MEDIA_URL + producto["imagen"])
        productos_list.append(producto)

    return JsonResponse(productos_list, safe=False)
