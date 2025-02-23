import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentStatus = ({ status }) => {
  const navigate = useNavigate();

  return (
    <div className="payment-status">
      {status === "success" && (
        <div>
          <h2>¡Pago exitoso!</h2>
          <p>Gracias por tu compra.</p>
        </div>
      )}
      {status === "failure" && (
        <div>
          <h2>Pago fallido</h2>
          <p>Por favor, intenta nuevamente.</p>
          <button onClick={() => navigate("/user/carrito")}>Reintentar</button>
        </div>
      )}
      {status === "pending" && (
        <div>
          <h2>Pago pendiente</h2>
          <p>Estamos procesando tu pago.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;