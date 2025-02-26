import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgregarPromocion from './AgregarPromocion';
import EditarPromocion from './EditarPromocion';
import Swal from 'sweetalert2';

function Promociones() {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [promociones, setPromociones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [currentPromocion, setCurrentPromocion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promoRes, prodRes] = await Promise.all([
          axios.get('http://localhost:8000/api/promociones/'),
          axios.get('http://localhost:8000/api/productos/')
        ]);
        
        const promocionesFormateadas = promoRes.data.map(promo => ({
          ...promo,
          fecha_inicio: new Date(promo.fecha_inicio),
          fecha_fin: new Date(promo.fecha_fin)
        }));
        
        setPromociones(promocionesFormateadas);
        setProductos(prodRes.data);
      } catch (err) {
        setError('Error cargando datos');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddPromocion = async (newPromo) => {
    try {
      const responses = await Promise.all(
        newPromo.productos_seleccionados.map(productoId => 
          axios.post('http://localhost:8000/api/promociones/', {
            porcentaje: newPromo.porcentaje,
            fecha_inicio: newPromo.fecha_inicio,
            fecha_fin: newPromo.fecha_fin,
            id_producto: productoId
          })
        )
      );
      
      const nuevasPromociones = responses.map(response => ({
        ...response.data,
        fecha_inicio: new Date(response.data.fecha_inicio),
        fecha_fin: new Date(response.data.fecha_fin)
      }));
      
      setPromociones(prev => [...prev, ...nuevasPromociones]);
      setIsAdding(false);
      Swal.fire({
        title: "Promoción agregada exitosamente",
        icon: "success",
        confirmButtonText: "OK",
        timer: 1500
      });
    } catch (err) {
      console.error('Error agregando promoción:', err);
      Swal.fire({
        title: "Error",
        text: "Error al guardar. Verifica los datos.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  const handleEditPromocion = async (updatedPromo) => {
    try {
      // Asegurar el tipo correcto para id_producto
      const payload = {
        ...updatedPromo,
        id_producto: parseInt(updatedPromo.id_producto)
      };
  
      const response = await axios.put(
        `http://localhost:8000/api/promociones/${updatedPromo.id_promocion}/`,
        payload
      );
      
      const promocionActualizada = {
        ...response.data,
        fecha_inicio: new Date(response.data.fecha_inicio),
        fecha_fin: new Date(response.data.fecha_fin)
      };
  
      setPromociones(prev => 
        prev.map(p => p.id_promocion === updatedPromo.id_promocion ? promocionActualizada : p)
      );
      setIsEditing(false);
      Swal.fire({
        title: "Promoción actualizada exitosamente",
        icon: "success",
        confirmButtonText: "OK",
        timer: 1500
      });
    } catch (err) {
      const errorDetails = err.response?.data;
      console.error('Error completo:', errorDetails);
      
      const errorMessage = 
        errorDetails?.id_producto?.[0] ||
        errorDetails?.non_field_errors?.[0] ||
        'Error al guardar. Verifica los datos';
      
      Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK"
      });
    }
  };

  const handleDeletePromocion = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/promociones/${id}/`);
      setPromociones(prev => prev.filter(p => p.id_promocion !== id));
    } catch (err) {
      console.error('Error eliminando:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getUTCDate().toString().padStart(2, '0')}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCFullYear()}`;
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="main-content">
      <h2 className="title-promociones">Gestión de Promociones</h2>
  
      <div className="search-and-add-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Buscar por producto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-add-promocion" onClick={() => setIsAdding(true)}>
          Agregar Promoción
        </button>
      </div>
  
      <div className="table-container">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Producto</th>
              <th className="px-4 py-2">Porcentaje</th>
              <th className="px-4 py-2">Inicio</th>
              <th className="px-4 py-2">Fin</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {promociones
              .filter((promo) =>
                promo.producto?.toLowerCase().includes(search.toLowerCase())
              )
              .map((promo) => (
                <tr key={promo.id_promocion} className="border-t">
                  <td className="px-4 py-2">{promo.producto || "N/A"}</td>
                  <td className="px-4 py-2">{Math.round(promo.porcentaje * 100)}%</td>
                  <td className="px-4 py-2">{formatDate(promo.fecha_inicio)}</td>
                  <td className="px-4 py-2">{formatDate(promo.fecha_fin)}</td>
                  <td className="px-4 py-2">
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setCurrentPromocion(promo);
                        setIsEditing(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeletePromocion(promo.id_promocion)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
  
      {isAdding && (
        <AgregarPromocion
          productos={productos}
          onClose={() => setIsAdding(false)}
          onSave={handleAddPromocion}
        />
      )}
  
      {isEditing && currentPromocion && (
        <EditarPromocion
          promocion={currentPromocion}
          onClose={() => setIsEditing(false)}
          onSave={handleEditPromocion}
        />
      )}
    </div>
  );
}

export default Promociones;