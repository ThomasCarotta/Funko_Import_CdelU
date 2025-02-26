import React, { useState } from 'react';
import Swal from 'sweetalert2';

function AgregarDescuento({ onClose, onAddDescuento }) {
  const [newDescuento, setNewDescuento] = useState({
    fechaInicio: '',
    fechaFin: '',
    porcentaje: 0.1
  });

  const handleSave = () => {
    if (!newDescuento.fechaInicio || !newDescuento.fechaFin) {
      Swal.fire({
        title: "Ambas fechas son obligatorias",
        icon: "warning",
        confirmButtonText: "OK"
      });
      return;
    }
    
    if (new Date(newDescuento.fechaFin) < new Date(newDescuento.fechaInicio)) {
      Swal.fire({
        title: "La fecha fin no puede ser anterior a la fecha inicio",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }
    
    onAddDescuento(newDescuento);
    onClose();
  };
  
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Nuevo Descuento</h3>
        <div className="form-group">
          <label>Fecha Inicio:
            <input
              type="date"
              value={newDescuento.fechaInicio}
              onChange={e => setNewDescuento({...newDescuento, fechaInicio: e.target.value})}
            />
          </label>
        </div>
        <div className="form-group">
          <label>Fecha Fin:
            <input
              type="date"
              value={newDescuento.fechaFin}
              onChange={e => setNewDescuento({...newDescuento, fechaFin: e.target.value})}
            />
          </label>
        </div>
        <div className="form-group">
          <label>Porcentaje (%):
            <input
              type="number"
              min="1"
              max="100"
              value={(newDescuento.porcentaje * 100).toFixed(0)}
              onChange={e => setNewDescuento({
                ...newDescuento,
                porcentaje: parseFloat(e.target.value) / 100
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

export default AgregarDescuento;