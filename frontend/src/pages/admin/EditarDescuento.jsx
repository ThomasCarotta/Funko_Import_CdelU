import React, { useState } from 'react';
import Swal from 'sweetalert2';

function EditarDescuento({ descuento, onClose, onEditDescuento }) {
  const [updatedDescuento, setUpdatedDescuento] = useState(descuento);

  const handleSave = () => {
    if (!updatedDescuento.fechaInicio || !updatedDescuento.fechaFin) {
      Swal.fire({
        title: "Ambas fechas son obligatorias",
        icon: "warning",
        confirmButtonText: "Ok"
      });
      return;
    }
    onEditDescuento(updatedDescuento);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Editar Descuento</h3>
        <div className="form-group">
          <label>Código:
            <input
              type="text"
              value={updatedDescuento.codigoDescuento}
              disabled
            />
          </label>
        </div>
        <div className="form-group">
          <label>Fecha Inicio:
            <input
              type="date"
              value={updatedDescuento.fechaInicio}
              onChange={e => setUpdatedDescuento({
                ...updatedDescuento,
                fechaInicio: e.target.value
              })}
            />
          </label>
        </div>
        <div className="form-group">
          <label>Fecha Fin:
            <input
              type="date"
              value={updatedDescuento.fechaFin}
              onChange={e => setUpdatedDescuento({
                ...updatedDescuento,
                fechaFin: e.target.value
              })}
            />
          </label>
        </div>
        <div className="form-group">
          <label>Porcentaje (%):
            <input
              type="number"
              min="1"
              max="100"
              value={(updatedDescuento.porcentaje * 100).toFixed(0)}
              onChange={e => setUpdatedDescuento({
                ...updatedDescuento,
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

export default EditarDescuento;