import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import Swal from 'sweetalert2';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail");

  const fetchCart = async () => {
    try {
      if (!userEmail) {
        Swal.fire({
          title: "Usuario no autenticado",
          icon: "warning",
          confirmButtonText: "ok"
        });
        return;
      }

      const response = await fetch("http://localhost:8000/api/auth/obtener-carrito/", {
        method: "GET",
        headers: {
          "userEmail": userEmail,
        },
      });

      const data = await response.json();
      if (data.error) {
        Swal.fire({
          title: data.error,
          icon: "error",
          confirmButtonText: "OK"
        });
        setLoading(false);
        return;
      }

      const cartWithQuantity = data.productos.map((item) => ({ ...item, quantity: 1 }));
      setCart(cartWithQuantity);
      calcularTotal(cartWithQuantity);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userEmail]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status'); // Mercado Pago envía el estado del pago como parámetro en la URL

    if (status === 'success') {
      // Obtener los datos del carrito desde el estado
      if (!cart.length || !userEmail) {
        Swal.fire({
          title: "No se encontraron datos de la compra",
          icon: "error",
          confirmButtonText: "OK"
        });
        return;
      }

      // Calcular el total del carrito
      const total = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);

      // Hacer una solicitud POST a payment_success para registrar la compra
      fetch("http://127.0.0.1:8000/api/auth/payment-success/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payer: {
            email: userEmail,
          },
          total: total,
          items: cart.map(item => ({
            idProducto: item.idProducto,
            quantity: item.quantity,
            unit_price: item.precio,
          })),
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.message === "Compra registrada con éxito") {
          Swal.fire({
            title: "Compra registrada con éxito",
            icon: "success",
            confirmButtonText: "OK"
          });
          // Limpiar el carrito
          setCart([]);
          // Redirigir al usuario a la página de inicio
          navigate("/");
        } else {
          Swal.fire({
            title: "Error al registrar la compra",
            text: data.error,
            icon: "error",
            confirmButtonText: "OK"
          });
        }
      })
      .catch(error => {
        console.error("Error al registrar la compra:", error);
        Swal.fire({
          title: "Error al registrar la compra",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK"
        });
      });
    }
  }, [cart, userEmail, navigate]);

  const calcularTotal = (cart) => {
    const subtotal = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);
    const envio = 50; // Envío fijo de $50
    const totalConEnvio = subtotal + envio;
    setTotal(totalConEnvio.toFixed(2));
};

  const removeProduct = async (idProducto) => {
    if (!userEmail) {
      console.error("Error: userEmail no está definido");
      return;
    }

    try {
      const url = `http://127.0.0.1:8000/api/auth/eliminar-producto-carrito/?idProducto=${encodeURIComponent(idProducto)}&userEmail=${encodeURIComponent(userEmail)}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar producto");
      }

      const data = await response.json();
      console.log("Producto eliminado con éxito:", data.message);

      await fetchCart();
      Swal.fire({
        title: "Producto eliminado del carrito",
        icon: "success",
        confirmButtonText: "OK",
        timer: 1500
      });
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error.message);
      Swal.fire({
        title: "Error al eliminar producto del carrito",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) return;

    const updatedCart = cart.map((item) =>
      item.idProducto === productId ? { ...item, quantity: newQuantity } : item
    );

    setCart(updatedCart);
    calcularTotal(updatedCart);
  };

  const applyDiscount = async () => {
    if (!discountCode) {
      Swal.fire({
        title: "Por favor, ingresa un código de descuento.",
        icon: "warning",
        confirmButtonText: "ok"
      });
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8000/api/auth/aplicar-descuento/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigoDescuento: discountCode,
          userEmail: userEmail,
        }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error al aplicar descuento");
      }
  
      setDiscountApplied(true);
      setDiscountAmount(parseFloat(data.descuento));
  
      // Calcular el subtotal sin el envío
      const subtotal = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);
      const descuentoAplicado = subtotal * (parseFloat(data.descuento) / 100);
      const totalConDescuento = (subtotal - descuentoAplicado) + 50; // Aplicar descuento solo al subtotal y luego sumar el envío
  
      setTotal(totalConDescuento.toFixed(2));  // Aquí se actualiza el total con el descuento aplicado
      Swal.fire({
        title: "Descuento aplicado correctamente",
        icon: "success",
        confirmButtonText: "ok",
        timer: 1500
      });
    } catch (error) {
      console.error("Error al aplicar descuento:", error.message);
      Swal.fire({
        title: "Error al aplicar descuento",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  const handleCheckout = async () => {
    try {
        if (cart.length === 0) {
          Swal.fire({
            title: "Tu carrito está vacío",
            icon: "warning",
            confirmButtonText: "OK"
          });
            return;
        }

        // Validar datos antes de enviar
        if (!total || !userEmail) {
          Swal.fire({
            title: "Faltan datos requeridos para procesar el pago",
            icon: "error",
            confirmButtonText: "OK"
          });
            return;
        }

        // Calcular el subtotal sin el envío
        const subtotal = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);

        // Calcular el descuento aplicado
        const descuentoAplicado = subtotal * (discountAmount / 100);

        // Calcular el total con envío y descuento
        const totalConDescuentoYEnvio = (subtotal - descuentoAplicado) + 50;

        const requestBody = {
            total: totalConDescuentoYEnvio.toFixed(2),
            items: cart.map(item => ({
                idProducto: item.idProducto,
                title: item.nombre,
                quantity: item.quantity,
                unit_price: item.precio,
            })),
            payer: {
                email: userEmail,
            },
        };

        console.log("Datos enviados al backend:", requestBody); // Depuración

        const response = await fetch("http://localhost:8000/api/auth/create-payment-preference/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al crear preferencia de pago");
        }

        const data = await response.json();
        if (data.preferenceId) {
            // Guardar el carrito en localStorage antes de redirigir
            localStorage.setItem('cart', JSON.stringify(cart));
            // Redirigir a Mercado Pago
            window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?preference-id=${data.preferenceId}`;
        } else {
            throw new Error("No se recibió un ID de preferencia válido");
        }
    } catch (error) {
        console.error("Error al procesar el pago:", error.message);
        Swal.fire({
          title: "Error al procesar el pago",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK"
        });
    }
};

  if (loading) return <p>Cargando carrito...</p>;

  return (
    <>
      <Header />
      <div className="cart-container">
        <h1>Carrito de Compras</h1>
        {cart.length === 0 ? (
          <p>Tu carrito está vacío</p>
        ) : (
          <div className="cart-table">
            <div className="cart-header">
              <div>Producto</div>
              <div>Precio</div>
              <div>Cantidad</div>
              <div>Total</div>
              <div>Acciones</div>
            </div>

            {cart.map((item) => (
              <div key={item.idProducto} className="cart-item">
                <div className="cart-product">
                  <img
                    src={`http://localhost:8000${item.imagen}`}
                    alt={item.nombre}
                    className="cart-item-img"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                  />
                  <span>{item.nombre}</span>
                </div>
                <div>${item.precio}</div>
                <div className="cart-quantity">
                  <button onClick={() => updateQuantity(item.idProducto, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.idProducto, item.quantity + 1)}>+</button>
                </div>
                <div>${(item.precio * item.quantity).toFixed(2)}</div>
                <div>
                  <button className="remove-btn" onClick={() => removeProduct(item.idProducto)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${cart.reduce((acc, item) => acc + item.precio * item.quantity, 0).toFixed(2)}</span>  {/* Subtotal sin descuento */}
                </div>
                <div className="summary-row">
                  <span>Envío</span>
                  <span>$50.00</span>
                </div>
                {discountApplied && (
                  <div className="summary-row">
                    <span>Descuento</span>
                    <span>-{discountAmount}%</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${total}</span>  {/* Total final con envío y descuento aplicado */}
                </div>
              </div>

            <div className="discount-section">
              <input
                type="text"
                placeholder="Código de descuento"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button onClick={applyDiscount} className="apply-discount-btn">
                Aplicar Descuento
              </button>
            </div>

            <div className="cart-actions">
              <button onClick={() => navigate("/")} className="cancel-btn">
                Cancelar
              </button>
              <button onClick={handleCheckout} className="checkout-btn">
                Pagar con Mercado Pago
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;