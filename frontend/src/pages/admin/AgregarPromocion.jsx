import React, { useState } from 'react';
import Swal from 'sweetalert2';

function AgregarPromocion({ productos, onClose, onSave }) {
  const [nuevaPromo, setNuevaPromo] = useState({
    porcentaje: 10,
    fecha_inicio: '',
    fecha_fin: '',
    productos_seleccionados: []
  });

  const handleSelectProduct = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setNuevaPromo({...nuevaPromo, productos_seleccionados: selectedOptions});
  };

  const handleSave = () => {
    if (nuevaPromo.productos_seleccionados.length === 0 || !nuevaPromo.fecha_inicio || !nuevaPromo.fecha_fin) {
      Swal.fire({
        title: "Todos los campos son obligatorios",
        icon: "warning",
        confirmButtonText: "OK"
      });
      return;
    }
    onSave({
      ...nuevaPromo,
      porcentaje: nuevaPromo.porcentaje / 100
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Nueva Promoción</h3>
        
        <label>
          Productos:
          <select
            multiple
            size="5"
            value={nuevaPromo.productos_seleccionados}
            onChange={handleSelectProduct}
            className="multi-select"
          >
            {productos.map(producto => (
              <option key={producto.idProducto} value={producto.idProducto}>
                {producto.nombre}
              </option>
            ))}
          </select>
          <small>(Ctrl/Cmd para múltiple selección)</small>
        </label>

        <div className="selected-products">
          <strong>Seleccionados:</strong>
          {nuevaPromo.productos_seleccionados.map(id => (
            <div key={id}>
              {productos.find(p => p.idProducto == id)?.nombre}
            </div>
          ))}
        </div>

        <label>
          Porcentaje (%):
          <input
            type="number"
            step="1"
            min="1"
            max="100"
            value={nuevaPromo.porcentaje}
            onChange={(e) => {
              let value = parseInt(e.target.value) || 1;
              value = Math.min(Math.max(value, 1), 100);
              setNuevaPromo({...nuevaPromo, porcentaje: value});
            }}
          />
        </label>

        <label>
          Fecha Inicio:
          <input
            type="date"
            value={nuevaPromo.fecha_inicio}
            onChange={(e) => setNuevaPromo({
              ...nuevaPromo,
              fecha_inicio: e.target.value
            })}
          />
        </label>

        <label>
          Fecha Fin:
          <input
            type="date"
            value={nuevaPromo.fecha_fin}
            onChange={(e) => setNuevaPromo({
              ...nuevaPromo,
              fecha_fin: e.target.value
            })}
          />
        </label>

        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

export default AgregarPromocion;