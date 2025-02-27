import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaBox, FaUsers, FaTrophy } from "react-icons/fa";
import "../../Admin.css";

function AdminHome() {
  const [data, setData] = useState({
    ventas_totales: 0,
    productos_activos: 0,
    clientes_activos: 0,
    producto_mas_vendido: "Cargando...",
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/auth/admin-dashboard-data/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener datos");
        }
        return response.json();
      })
      .then((json) => {
        console.log("Datos recibidos:", json); // Depuración
        setData({
          ventas_totales: json.ventas_totales || 0,
          productos_activos: json.productos_activos || 0,
          clientes_activos: json.clientes_activos || 0,
          producto_mas_vendido: json.producto_mas_vendido || "N/A",
        });
      })
      .catch((error) => console.error("Error al obtener datos:", error));
  }, []);

  return (
    <div className="main-content">
      <div className="home-container">
        <div className="row">
          <div className="card blue">
            <FaShoppingCart className="card-icon" />
            <h2>Ventas Totales</h2>
            <p>${data.ventas_totales.toFixed(2)}</p> {/* Formatear a 2 decimales */}
          </div>
          <div className="card green">
            <FaBox className="card-icon" />
            <h2>Productos Activos</h2>
            <p>{data.productos_activos}</p>
          </div>
          <div className="card yellow">
            <FaUsers className="card-icon" />
            <h2>Clientes Activos</h2>
            <p>{data.clientes_activos}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;