import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function EditarPromocion({ promocion, onClose, onSave }) {
  const [editedPromo, setEditedPromo] = useState({
    id_promocion: promocion.id_promocion,
    porcentaje: Math.round(promocion.porcentaje * 100),
    fecha_inicio: new Date(promocion.fecha_inicio).toISOString().split('T')[0],
    fecha_fin: new Date(promocion.fecha_fin).toISOString().split('T')[0],
    id_producto: promocion.id_producto.idProducto || promocion.id_producto
  });

  const [productoNombre, setProductoNombre] = useState('');

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/productos/${editedPromo.id_producto}/`);
        const data = await response.json();
        setProductoNombre(data.nombre);
      } catch (error) {
        console.error('Error fetching producto:', error);
      }
    };
    fetchProducto();
  }, [editedPromo.id_producto]);

  const handleSave = () => {
    if (!editedPromo.porcentaje || !editedPromo.fecha_inicio || !editedPromo.fecha_fin) {
      Swal.fire({
        title: "Todos los campos son obligatorios",
        icon: "warning",
        confirmButtonText: "OK"
      });
      return;
    }

    if (new Date(editedPromo.fecha_fin) < new Date(editedPromo.fecha_inicio)) {
      Swal.fire({
        title: "La fecha de fin no puede ser anterior a la fecha de inicio",
        icon: "warning",
        confirmButtonText: "OK"
      });
      return;
    }

    const payload = {
      ...editedPromo,
      porcentaje: parseFloat(editedPromo.porcentaje) / 100,
      // Mantener las fechas en formato YYYY-MM-DD sin conversión adicional
      fecha_inicio: editedPromo.fecha_inicio,
      fecha_fin: editedPromo.fecha_fin
    };

    onSave(payload);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Editar Promoción</h3>
        
        <div className="form-group">
          <label>Producto:
            <input
              type="text"
              value={productoNombre || 'Cargando...'}
              disabled
            />
          </label>
        </div>

        <div className="form-group">
          <label>Porcentaje (%):
            <input
              type="number"
              min="1"
              max="100"
              value={editedPromo.porcentaje}
              onChange={(e) => {
                let value = parseInt(e.target.value) || 1;
                value = Math.min(Math.max(value, 1), 100);
                setEditedPromo({...editedPromo, porcentaje: value});
              }}
            />
          </label>
        </div>

        <div className="form-group">
          <label>Fecha Inicio:
            <input
              type="date"
              value={editedPromo.fecha_inicio}
              onChange={(e) => setEditedPromo({
                ...editedPromo,
                fecha_inicio: e.target.value
              })}
            />
          </label>
        </div>

        <div className="form-group">
          <label>Fecha Fin:
            <input
              type="date"
              value={editedPromo.fecha_fin}
              onChange={(e) => setEditedPromo({
                ...editedPromo,
                fecha_fin: e.target.value
              })}
            />
          </label>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

export default EditarPromocion;