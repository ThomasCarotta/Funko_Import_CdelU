import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Admin.css";

const VentasAdmin = () => {
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
          params: { admin: true },
        });
        setVentas(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar las ventas:", err);
        setError("Error al cargar las ventas.");
        setLoading(false);
      }
    };

    fetchVentas();
  }, [navigate]);

  const handleStatusChange = async (ventaId, newStatus) => {
    try {
        const response = await axios.patch(`http://127.0.0.1:8000/api/auth/update-venta/${ventaId}/`, {
            estado: newStatus,
        });

        // Actualiza el estado de la venta en el frontend
        setVentas((prevVentas) =>
            prevVentas.map((venta) =>
                venta.id === ventaId
                    ? {
                        ...venta,
                        estado: newStatus, // Actualiza el estado
                        codigo_seguimiento: response.data.codigo_seguimiento || venta.codigo_seguimiento, // Actualiza el código de seguimiento si existe
                    }
                    : venta
            )
        );
    } catch (err) {
        console.error("Error al actualizar el estado de la venta:", err);
    }
};

  if (loading) return <div className="ventas-container">Cargando...</div>;
  if (error) return <div className="ventas-container error">{error}</div>;

  return (
    <div className="ventas-container">
      <h1 className="ventas-title">Todas las Ventas</h1>

      {ventas.length > 0 ? (
        <table className="ventas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Productos</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
          {ventas.map((venta) => (
    <tr key={venta.id}>
        <td>{venta.id}</td>
        <td>{venta.usuario}</td>
        <td>{new Date(venta.fecha_venta).toLocaleDateString()}</td>
        <td>${venta.total}</td>
        <td>
            <ul className="productos-list">
                {venta.productos.map((producto) => (
                    <li key={producto.id}>
                        {producto.nombre} x{producto.cantidad} - ${producto.total}
                    </li>
                ))}
            </ul>
        </td>
        <td>
            <select
                value={venta.estado || "en_espera"}
                onChange={(e) => handleStatusChange(venta.id, e.target.value)}
                disabled={venta.estado === 'despachado'}
            >
                <option value="en_espera">En espera</option>
                <option value="despachado">Despachado</option>
                {/* <option value="cancelado">Cancelado</option> */}
            </select>
            {venta.codigo_seguimiento && (
                <div className="codigo-seguimiento">
                    Código: {venta.codigo_seguimiento}
                </div>
            )}
        </td>
    </tr>
))}
          </tbody>
        </table>
      ) : (
        <p>No hay ventas registradas.</p>
      )}

      <button onClick={() => navigate("/admin")} className="volver-btn">
        Volver al panel
      </button>
    </div>
  );
};

export default VentasAdmin;
