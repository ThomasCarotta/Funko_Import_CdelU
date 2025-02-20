import React, { useState } from 'react';
import axios from 'axios';

function AgregarStock({ closeModal, productos, onAddStock }) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [cantidad, setCantidad] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/ingresostock/', {
        cantidadIngresa: cantidad,
        idProducto: selectedProduct
      });
      if (response.status === 201) {
        onAddStock();
        closeModal();
        alert('Stock agregado exitosamente!');
      }
    } catch (error) {
      console.error('Error al agregar stock:', error);
      alert('Error al agregar stock');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Agregar Stock</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Producto</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
            >
              <option value="">Seleccione un producto</option>
              {productos.map(producto => (
                <option key={producto.idProducto} value={producto.idProducto}>
                  {producto.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Cantidad</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={closeModal}>Cancelar</button>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AgregarStock;