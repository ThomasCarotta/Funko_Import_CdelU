import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import Swal from 'sweetalert2';

const PaymentMethod = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extrae la dirección y el total desde location.state
  const { address, total } = location.state || {};

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Obtener el correo electrónico del usuario autenticado
      const userEmail = localStorage.getItem("userEmail");

      if (!userEmail) {
        throw new Error("Usuario no autenticado");
      }

      // Crear la preferencia de pago en el backend
      const response = await fetch("http://localhost:8000/api/auth/create-payment-preference/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          total: total, // El total a pagar
          items: [
            {
              title: "Compra de Funko",
              quantity: 1,
              unit_price: parseFloat(total),
            },
          ],
          payer: {
            email: userEmail, // Usar el correo del usuario autenticado
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear la preferencia de pago");
      }

      // Redirigir al usuario a la página de pago de Mercado Pago
      window.location.href = data.init_point;
    } catch (error) {
      console.error("Error al procesar el pago:", error.message);
      Swal.fire({
        title: "Error al procesar el pago",
        text: error.message,
        icon: "error",
        confirmButtonText: "Ok"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="payment-method">
        <h2>Resumen del Pedido</h2>
        <p>Total a pagar: ${total}</p>
        <p>Dirección de envío: {address}</p>
        <div className="payment-actions">
          <button
            onClick={() => navigate("/user/shipping")} // Volver a ShippingMethod
            className="back-btn"
          >
            Volver
          </button>
          <button
            onClick={handlePayment} // Manejar el pago y redirigir
            className="pay-btn"
            disabled={loading}
          >
            {loading ? "Procesando..." : "Pagar con Mercado Pago"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentMethod;