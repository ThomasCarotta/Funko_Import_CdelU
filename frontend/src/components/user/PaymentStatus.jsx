import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';

const PaymentStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPurchaseRegistered, setIsPurchaseRegistered] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const status = urlParams.get("status");
    const paymentId = urlParams.get("payment_id");
  
    // Verificar si ya se procesó esta compra
    if (status !== "approved" || sessionStorage.getItem(`purchase_${paymentId}`)) {
      return;
    }
  
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const userEmail = sessionStorage.getItem("userEmail");
    const discountAmount = parseFloat(sessionStorage.getItem("discountAmount")) || 0;
  
    if (!cart.length || !userEmail) {
      Swal.fire({
        title: "No se encontraron datos de la compra",
        icon: "error",
        confirmButtonText: "OK"
      });
      navigate("/");
      return;
    }
  
    const subtotal = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);
    const descuentoAplicado = subtotal * (discountAmount / 100);
    const totalConDescuentoYEnvio = (subtotal - descuentoAplicado) + 50;
  
    fetch("http://127.0.0.1:8000/api/auth/payment-success/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment_id: paymentId,
        payer: { email: userEmail },
        total: totalConDescuentoYEnvio,
        descuento: discountAmount,
        items: cart.map((item) => ({
          idProducto: item.idProducto,
          quantity: item.quantity,
          unit_price: item.precio,
        })),
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Compra registrada con éxito") {
        Swal.fire({ title: "Compra registrada con éxito", icon: "success", confirmButtonText: "OK" });
        sessionStorage.setItem(`purchase_${paymentId}`, "true"); // Marcar compra como procesada
      } else {
        Swal.fire({ title: "Error al registrar la compra", text: data.error || "Error desconocido", icon: "error", confirmButtonText: "OK" });
      }
    })
    .catch((error) => {
      console.error("Error al registrar la compra:", error);
      Swal.fire({ title: "Error al registrar la compra", text: error.message, icon: "error", confirmButtonText: "OK" });
    })
    .finally(() => {
      sessionStorage.removeItem("cart");
      sessionStorage.removeItem("discountAmount");
      navigate("/");
    });
  }, [location, navigate]);
  

  return (
    <div className="payment-status">
      <h2>Procesando pago...</h2>
    </div>
  );
};

export default PaymentStatus;