import React, { useState } from 'react';
import Swal from 'sweetalert2';

function AgregarCategoria({ onClose, onAddCategory }) {
  const [newCategory, setNewCategory] = useState({ nombre: ''});

  const handleSave = () => {
    if (newCategory.nombre.trim() === '') {
      Swal.fire({
        title: "El nombre de la categoría es obligatorio",
        icon: "warning",
        confirmButtonText: "OK"
      });
      return;
    }
    onAddCategory(newCategory);
    setNewCategory({ nombre: ''});
    onClose();
  };

  return (
    <div className="modalAC">
      <div className="modal-contentAC">
        <h3>Agregar Nueva Categoría</h3>
        <div className="blockAC">
          <label>
            Nombre de la Categoría:
            <input
              type="text"
              placeholder="Ingrese el nombre"
              value={newCategory.nombre}
              onChange={(e) => setNewCategory({ ...newCategory, nombre: e.target.value })}
            />
          </label>
        </div>
        {/* <div className="blockAC">
          <label>
            Cantidad:
            <input
              type="number"
              min="0"
              placeholder="Ingrese la cantidad"
              value={newCategory.cantidad}
              onChange={(e) =>
                setNewCategory({ ...newCategory, cantidad: parseInt(e.target.value, 10) || 0 })
              }
            />
          </label>
        </div> */}
        <div className="modal-actionsAC">
          <button className="btn-cancelAC" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-saveAC" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgregarCategoria;
