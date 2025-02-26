import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';

const PaymentStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const status = urlParams.get("status"); // Obtener el estado del pago desde la URL
    const paymentId = urlParams.get("payment_id"); // Obtener el payment_id desde la URL

    console.log("Estado del pago:", status); // Depuración
    console.log("Payment ID:", paymentId); // Depuración

    if (status === "approved") {  // Solo si el pago fue aprobado
      // Obtener los datos del carrito desde el localStorage
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const userEmail = localStorage.getItem("userEmail");

      if (!cart.length || !userEmail) {
        Swal.fire({
          title: "No se encontraron datos de la compra",
          icon: "error",
          confirmButtonText: "OK"
        });
        navigate("/"); // Redirigir al home si no hay datos
        return;
      }

      // Calcular el total del carrito
      const total = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);

      console.log("Carrito:", cart); // Depuración
      console.log("Email del usuario:", userEmail); // Depuración
      console.log("Total calculado:", total); // Depuración

      // Hacer una solicitud POST a payment-success para registrar la compra
      console.log("Enviando solicitud POST a payment-success...");
      fetch("http://127.0.0.1:8000/api/auth/payment-success/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_id: paymentId, // ID de la transacción de Mercado Pago
          payer: {
            email: userEmail, // Correo del usuario autenticado
          },
          total: total, // Total de la compra
          items: cart.map((item) => ({
            idProducto: item.idProducto,
            quantity: item.quantity,
            unit_price: item.precio,
          })),
        }),
      })
        .then((response) => {
          console.log("Respuesta del backend (cruda):", response); // Depuración
          if (!response.ok) {
            return response.text().then((text) => {  // Usar .text() en lugar de .json()
              console.error("Error del backend (texto):", text); // Depuración
              throw new Error(text || "Error al registrar la compra");
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log("Datos recibidos del backend:", data); // Depuración
          if (data.message === "Compra registrada con éxito") {
            Swal.fire({
              title: "Compra registrada con éxito",
              icon: "success",
              confirmButtonText: "OK"
            });
            // Limpiar el carrito
            localStorage.removeItem("cart");
            // Redirigir al usuario a la página de inicio (home)
            navigate("/");
          } else {
            Swal.fire({
              title: "Error al registrar la compra",
              text: data.error || "Error desconocido",
              icon: "error",
              confirmButtonText: "OK"
            });
            navigate("/"); // Redirigir al home en caso de error
          }
        })
        .catch((error) => {
          console.error("Error al registrar la compra:", error);
          Swal.fire({
            title: "Error al registrar la compra",
            text: error.message,
            icon: "error",
            confirmButtonText: "OK"
          });
          navigate("/"); // Redirigir al home en caso de error
        });
    } else {
      Swal.fire({
        title: "El pago no fue exitoso",
        text: "Por favor, intente de nuevo.",
        icon: "error",
        confirmButtonText: "OK"
      });
      navigate("/"); // Redirigir al home si el pago no fue aprobado
    }
  }, [location, navigate]);

  return (
    <div className="payment-status">
      <h2>Procesando pago...</h2>
    </div>
  );
};

export default PaymentStatus;