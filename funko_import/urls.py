from django.urls import path, include
from rest_framework import routers
from . import views


router = routers.DefaultRouter()
# router.register(r'Coleccion', views.ColeccionView, 'Coleccion')

router.register(r'usuarios', views.UsuarioView, basename='usuario')
router.register(r'colecciones', views.ColeccionView, basename='coleccion')
router.register(r'carritos', views.CarritoView, basename='carrito')
router.register(r'descuentos', views.DescuentoView, basename='descuento')
router.register(r'productos', views.ProductoView, basename='producto')
router.register(r'promociones', views.PromocionView, basename='promocion')
router.register(r'resenas', views.resenaComentarioView, basename='resena')
router.register(r'preguntas', views.preguntaView, basename='pregunta')
router.register(r'ediciones', views.EdicionView, basename='edicion')
router.register(r'facturas', views.facturaView, basename='factura')
router.register(r'lineafacturas', views.lineaFacturaView, basename='lineafactura')
router.register(r'ingresostock', views.IngresoStockView, basename='ingresostock')

urlpatterns = [
    path('', include(router.urls)),  # Rutas del router bajo el prefijo 'api/auth/'
    path('auth/google-login/', views.google_login, name='google_login'),  # Ahora estÃ¡ bajo 'api/auth/google-login/'
    # path("process_payment/", views.process_payment, name="process_payment"),
    path('auth/completar-perfil/', views.completar_perfil, name='completar_perfil'),
    path('auth/user-data/', views.user_data, name='user_data'),
    path('auth/update-profile/', views.update_profile, name='update_profile'),
    path('auth/admin-dashboard-data/', views.admin_dashboard_data, name='admin_dashboard_data'),
    path('auth/obtener-productos/', views.obtener_productos, name='obtener_productos'),
    path('auth/obtener-detalle-producto/<int:idProducto>/', views.obtener_detalle_producto, name='obtener_detalle_producto'),
    path('auth/aplicar-descuento/', views.aplicar_descuento, name='aplicar_descuento'),
    path('auth/add-to-cart/', views.add_to_cart, name='add_to_cart'),
    path('auth/obtener-carrito/', views.obtener_carrito, name='obtener_carrito'),
    path('auth/eliminar-producto-carrito/', views.eliminar_producto_carrito, name='eliminar_producto_carrito'),
    path('auth/create-payment-preference/', views.create_payment_preference, name='create_payment_preference'),
    path('auth/obtener-preguntas-producto/<int:idProducto>/', views.obtener_preguntas_producto, name='obtener_preguntas_producto'),
    path('auth/preguntas/', views.crear_pregunta, name='crear_pregunta'),
    path('auth/responder-pregunta/<int:idPregunta>/', views.responder_pregunta, name='responder_pregunta'),
    path('auth/payment-success/', views.payment_success, name="payment_success"),
    path('auth/get-ventas/', views.get_ventas, name="get_ventas"),
    path('auth/obtener-resenas-producto/<int:idProducto>/', views.obtener_resenas_producto, name="obtener_resenas_producto"),  # Updated path
    path('auth/crear-resena/', views.crear_resena, name="crear_resena"),
    path('auth/update-venta/<int:venta_id>/', views.actualizar_estado_venta, name="actualizar_estado_venta"),
    path('auth/actualizar-estado-venta/', views.actualizar_estado_venta, name="actualizar_estado_venta"),
    ]