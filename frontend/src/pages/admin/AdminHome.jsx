import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaBox, FaUsers } from "react-icons/fa";
import "../../Admin.css";
import axios from "axios";

function AdminHome() {
  const [data, setData] = useState({
    ventas_totales: 0,
    productos_activos: 0,
    clientes_activos: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener las ventas
        const ventasResponse = await axios.get("http://127.0.0.1:8000/api/auth/get-ventas/", {
          params: { admin: true },
        });

        // Sumar los totales de las ventas
        const ventasTotales = ventasResponse.data.reduce((total, venta) => total + venta.total, 0);

        // Obtener los datos de productos y clientes activos
        const dashboardResponse = await axios.get("http://localhost:8000/api/auth/admin-dashboard-data/");

        // Actualizar el estado con los datos obtenidos
        setData({
          ventas_totales: ventasTotales,
          productos_activos: dashboardResponse.data.productos_activos,
          clientes_activos: dashboardResponse.data.clientes_activos,
        });
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="main-content">
      <div className="home-container">
        <div className="row">
          <div className="card blue">
            <FaShoppingCart className="card-icon" />
            <h2>Ventas Totales</h2>
            <p>${data.ventas_totales}</p>
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