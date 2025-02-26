import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../App.css"; // Importa el archivo CSS

const MisCompras = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      navigate("/login");
      return;
    }

    const fetchVentas = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/get-ventas/", {
          params: { email: userEmail },
        });
        setVentas(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar las ventas:", err);
        setError("Error al cargar las ventas.");
        setLoading(false);
        if (err.response && err.response.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchVentas();
  }, [navigate]);

  if (loading) return <div className="mis-compras-container">Cargando...</div>;
  if (error) return <div className="mis-compras-container error">{error}</div>;

  return (
    <div className="mis-compras-container">
      <h1 className="mis-compras-title">Mis Compras</h1>

      {ventas.length > 0 ? (
        <ul>
          {ventas.map((venta) => (
            <li key={venta.id} className="venta-card">
              <h2>Venta ID: {venta.id}</h2>
              <p>Fecha de compra: {new Date(venta.fecha_venta).toLocaleDateString()}</p>
              <p>Total: ${venta.total}</p>
              <p>Código de seguimiento: <strong>ENV123456789</strong></p> 
              <h3>Productos:</h3>
              <ul className="producto-list">
                {venta.productos.map((producto) => (
                  <li key={producto.id} className="producto-item">
                    <p>Producto: {producto.nombre}</p>
                    <p>Cantidad: {producto.cantidad}</p>
                    <p>Precio unitario: ${producto.precio_unitario}</p>
                    <p>Total: ${producto.total}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes compras realizadas.</p>
      )}

      <button onClick={() => navigate("/user")} className="volver-btn">
        Volver al inicio
      </button>
    </div>
  );
};

export default MisCompras;