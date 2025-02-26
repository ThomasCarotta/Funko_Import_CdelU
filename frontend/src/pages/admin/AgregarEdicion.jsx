import React, { useState } from 'react';
import Swal from 'sweetalert2';

function AgregarEdicion({ onCancel, onSave }) {
  const [newEdition, setNewEdition] = useState({
    nombre: '', // Solo necesitamos el nombre
  });

  const handleSave = () => {
    if (newEdition.nombre.trim() === '') {
      Swal.fire({
        title: "El nombre de la edición es obligatorio",
        icon: "warning",
        confirmButtonText: "OK"
      });
      return;
    }
    onSave(newEdition); // Enviamos solo el nombre
  };

  return (
    <div className="modalAE">
      <div className="modal-contentAE">
        <h3>Agregar Nueva Edición</h3>
        <label className="blockAE my-2">
          Nombre:
          <input
            type="text"
            placeholder="Ingrese nombre de la edición"
            className="input-fieldAE"
            value={newEdition.nombre}
            onChange={(e) =>
              setNewEdition({ ...newEdition, nombre: e.target.value })
            }
          />
        </label>
        <div className="modal-actionsAE">
          <button className="btn-cancelAE" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn-saveAE" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgregarEdicion;