import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Importa useLocation
import "../../App.css";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import Swal from 'sweetalert2';

const ShippingMethod = () => {
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extrae el total desde location.state (enviado desde Cart.jsx)
  const { total } = location.state || {};

  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (!address) {
      Swal.fire({
        title: "Por favor ingresa tu dirección",
        icon: "warning",
        confirmButtonText: "ok"
      });
      return;
    }

    // Redirigir a PaymentMethod con la dirección y el total
    navigate("/user/payment", { state: { address, total } });
  };

  return (
    <>
      <Header />
      <div className="shipping-container">
        <h2>Dirección de Envío</h2>
        <p>Total a pagar: ${total}</p> {/* Muestra el total recibido desde Cart.jsx */}
        <input
          type="text"
          placeholder="Ingresa tu dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="shipping-actions">
          <button onClick={() => navigate("/user/carrito")} className="back-btn">
            Volver
          </button>
          <button onClick={handleNext} className="next-btn" disabled={loading}>
            {loading ? "Procesando..." : "Siguiente"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShippingMethod;