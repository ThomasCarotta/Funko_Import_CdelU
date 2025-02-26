import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function AgregarProducto({ closeModal, onAddProduct, colecciones = [], ediciones = [] }) {
  const [newProduct, setNewProduct] = useState({
    nombre: '',
    numero: 1,
    idEdicion: '',
    esEspecial: false,
    descripcion: '',
    brilla: false,
    precio: 0,
    cantidadDisp: 0,
    imagen: null, // Aquí se guardará el objeto File
    idColeccion: '',
    precio_original: 0
  });

  useEffect(() => {
    if (colecciones.length > 0) {
      setNewProduct(prev => ({
        ...prev,
        idColeccion: colecciones[0]?.idColeccion || ''
      }));
    }
  }, [colecciones]);

  // Función para capturar el objeto File cuando el usuario selecciona la imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct(prev => ({
        ...prev,
        imagen: file
      }));
    }
  };

  const handleAddProduct = () => {
    // Validación de campos obligatorios
    if (!newProduct.nombre || newProduct.precio <= 0 || newProduct.cantidadDisp < 0 || !newProduct.idColeccion) {
      Swal.fire({
        title: "Por favor complete todos los campos obligatorios (*)",
        icon: "warning",
        confirmButtonText: "OK"
      });
      return;
    }

    // Crear un objeto FormData para enviar los datos y el archivo
    const formData = new FormData();
    formData.append('nombre', newProduct.nombre);
    formData.append('numero', newProduct.numero);
    formData.append('idEdicion', newProduct.idEdicion);
    formData.append('esEspecial', newProduct.esEspecial ? 'True' : 'False');
    formData.append('descripcion', newProduct.descripcion);
    formData.append('brilla', newProduct.brilla ? 'True' : 'False');
    formData.append('precio', newProduct.precio);
    formData.append('cantidadDisp', newProduct.cantidadDisp);
    formData.append('idColeccion', newProduct.idColeccion);
    // Si existe imagen, la agregamos al FormData
    if (newProduct.imagen) {
      formData.append('imagen', newProduct.imagen);
    }

    onAddProduct(formData);
  };

  return (
    <div className="modalAP fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-contentAP bg-white p-6 rounded-lg shadow-xl w-[600px]">
        <h3 className="text-xl font-semibold mb-4">Agregar Nuevo Producto</h3>
        <div className="form-gridAP grid gap-4 grid-cols-2">
          <label className="block">
            <span className="text-gray-700">Imagen del Producto:</span>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              onChange={handleFileChange}  // Usamos la función que guarda el objeto File
            />
          </label>
          
          <label className="block">
            <span className="text-gray-700">Nombre del Producto:*</span>
            <input
              type="text"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              placeholder="Ingrese nombre del producto"
              value={newProduct.nombre}
              onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Número en Colección:</span>
            <input
              type="number"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              min="1"
              value={newProduct.numero}
              onChange={(e) => setNewProduct({ ...newProduct, numero: parseInt(e.target.value) || 1 })}
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Edición:</span>
            <select
                className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
                value={newProduct.idEdicion} // Usar idEdicion en lugar de nombreEdicion
                onChange={(e) => setNewProduct({ ...newProduct, idEdicion: e.target.value })}
              >
                <option value="">Seleccione edición</option>
                {ediciones.map(edicion => (
                  <option key={edicion.id_edicion} value={edicion.id_edicion}> {/* Enviar el ID */}
                    {edicion.nombre}
                  </option>
                ))}
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Colección:*</span>
            <select
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              value={newProduct.idColeccion}
              onChange={(e) => setNewProduct({ ...newProduct, idColeccion: parseInt(e.target.value) })}
              required
            >
              {colecciones.map(coleccion => (
                <option key={coleccion.idColeccion} value={coleccion.idColeccion}>
                  {coleccion.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Edición Especial:</span>
            <select
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              value={newProduct.esEspecial ? 'si' : 'no'}
              onChange={(e) => setNewProduct({ ...newProduct, esEspecial: e.target.value === 'si' })}
            >
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Brilla en la oscuridad:</span>
            <select
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              value={newProduct.brilla ? 'si' : 'no'}
              onChange={(e) => setNewProduct({ ...newProduct, brilla: e.target.value === 'si' })}
            >
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Stock:*</span>
            <input
              type="number"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              min="0"
              value={newProduct.cantidadDisp}
              onChange={(e) => setNewProduct({ ...newProduct, cantidadDisp: parseInt(e.target.value) || 0 })}
              required
            />
          </label>

          <label className="block col-span-2">
            <span className="text-gray-700">Descripción:</span>
            <textarea
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md h-24"
              placeholder="Ingrese descripción del producto"
              value={newProduct.descripcion}
              onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
            />
          </label>

          <label className="block col-span-2">
            <span className="text-gray-700">Precio:*</span>
            <input
              type="number"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              min="0"
              step="0.01"
              value={newProduct.precio}
              onChange={(e) => setNewProduct({ ...newProduct, precio: parseFloat(e.target.value) || 0 })}
              required
            />
          </label>
        </div>

        <div className="modal-actionsAP flex justify-end mt-4">
          <button
            className="btn-cancelAP text-sm text-gray-600 px-4 py-2 mr-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={closeModal}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="btn-saveAP text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={handleAddProduct}
            type="button"
          >
            Guardar Producto
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgregarProducto;
