import React, { useState } from 'react';

function EditarProducto({ producto, closeModal, onSave, ediciones }) {
  const [editedProduct, setEditedProduct] = useState({ ...producto });

  const handleSave = () => {
    onSave(editedProduct);
    closeModal();
  };

  return (
    <div className="modalAP fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-contentAP bg-white p-6 rounded-lg shadow-xl w-[600px]">
        <h3 className="text-xl font-semibold mb-4">Editar Producto</h3>

        <div className="form-gridAP grid gap-4 grid-cols-2">
          <label className="block">
            <span className="text-gray-700">Imagen del Producto:</span>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, imagen: e.target.files[0] })
              }
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Nombre del Producto:</span>
            <input
              type="text"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              value={editedProduct.nombre}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, nombre: e.target.value })
              }
            />
          </label>

          <label className="block">
            <span className="text-gray-700">SKU:</span>
            <input
              type="text"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              value={editedProduct.sku}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, sku: e.target.value })
              }
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Edición:</span>
            <select
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              value={editedProduct.idEdicion}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, idEdicion: e.target.value })
              }
            >
              {ediciones.map((edicion) => (
                <option key={edicion.id_edicion} value={edicion.id_edicion}>
                  {edicion.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Colección:</span>
            <select
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              value={editedProduct.idColeccion}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, idColeccion: e.target.value })
              }
            >
              <option value="Marvel">Marvel</option>
              <option value="DC">DC</option>
              <option value="Star Wars">Star Wars</option>
            </select>
          </label>

          <label className="block col-span-2">
            <span className="text-gray-700">Descripción:</span>
            <textarea
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              value={editedProduct.descripcion}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, descripcion: e.target.value })
              }
            />
          </label>

          <label className="block col-span-2">
            <span className="text-gray-700">Precio:</span>
            <input
              type="number"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              value={editedProduct.precio}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, precio: e.target.value })
              }
            />
          </label>
        </div>

        <div className="modal-actionsAP flex justify-end mt-4">
          <button
            className="btn-cancelAP text-sm text-gray-600 px-4 py-2 mr-2 border border-gray-300 rounded-lg"
            onClick={closeModal}
          >
            Cancelar
          </button>
          <button
            className="btn-saveAP text-white bg-blue-500 px-4 py-2 rounded-lg"
            onClick={handleSave}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditarProducto;