import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgregarProducto from './AgregarProducto';
import EditarProducto from './EditarProducto';
import Swal from 'sweetalert2';
function Productos() {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingStock, setIsAddingStock] = useState(false); // Estado para el modal de agregar stock
  const [productos, setProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [colecciones, setColecciones] = useState([]);
  const [ediciones, setEdiciones] = useState([]);

  useEffect(() => {
    fetchProductos();
    fetchColecciones();
    fetchEdiciones();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/productos/');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const fetchColecciones = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/colecciones/');
      setColecciones(response.data);
    } catch (error) {
      console.error('Error al obtener colecciones:', error);
    }
  };

  const fetchEdiciones = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/ediciones/');
      setEdiciones(response.data);
    } catch (error) {
      console.error('Error al obtener ediciones:', error);
    }
  };

  const handleAddProductClick = () => setIsAdding(true);
  const handleEditProductClick = (producto) => {
    setSelectedProduct(producto);
    setIsEditing(true);
  };

  const closeModal = () => {
    setIsAdding(false);
    setIsEditing(false);
    setIsAddingStock(false); // Cerrar el modal de agregar stock
    setSelectedProduct(null);
  };

  const addNewProduct = async (formData) => {
    try {
      const response = await axios.post('http://localhost:8000/api/productos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 201) {
        await fetchProductos();
        closeModal();
        Swal.fire({
          title: "Producto creado exitosamente",
          icon: "success",
          confirmButtonText: "OK",
          timer: 1500
        });
      }
    } catch (error) {
      console.error('Error detallado:', error.response?.data);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.detail || 'Error al crear producto',
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  };

  const saveEditedProduct = async (editedProduct) => {
    try {
      const formData = new FormData();
      for (const key in editedProduct) {
        if (editedProduct[key] !== null && editedProduct[key] !== undefined) {
          formData.append(key, editedProduct[key]);
        }
      }
  
      const response = await axios.put(
        `http://localhost:8000/api/productos/${editedProduct.idProducto}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      await fetchProductos();
      closeModal();
      Swal.fire({
        title: "Producto actualizado correctamente",
        icon: "success",
        confirmButtonText: "OK",
        timer: 1500
      });
    } catch (error) {
      console.error('Error al editar producto:', error);
      console.error('Detalles del error:', error.response?.data);
      Swal.fire({
        title: "Error",
        text: JSON.stringify(error.response?.data),
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };
  
  

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      await axios.delete(`http://localhost:8000/api/productos/${id}/`);
      setProductos(productos.filter(producto => producto.idProducto !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto');
    }
  };

  const handleAddStock = async () => {
    await fetchProductos(); // Refrescar la lista de productos después de agregar stock
  };

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-content">
      <h2 className="title-productos">Productos</h2>

      <div className="search-and-add-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Buscar Funko Pop"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-add-product" onClick={handleAddProductClick}>
          Agregar Producto
        </button>

      </div>

      <div className="table-container">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Imagen</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Precio</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <tr key={producto.idProducto}>
                <td className="px-4 py-2">
                  <img 
                    src={producto.imagen} 
                    alt={producto.nombre} 
                    className="w-16 h-16 object-cover" 
                  />
                </td>
                <td className="px-4 py-2">{producto.nombre}</td>
                <td className="px-4 py-2">
                  {colecciones.find(c => c.idColeccion === producto.idColeccion)?.nombre}
                </td>
                <td className="px-4 py-2">${producto.precio}</td>
                <td className="px-4 py-2">{producto.cantidadDisp}</td>
                <td className="px-4 py-2">
                  <button className="btn-edit" onClick={() => handleEditProductClick(producto)}>
                    Editar
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => handleDeleteProduct(producto.idProducto)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAdding && colecciones.length > 0 && ediciones.length > 0 && (
        <AgregarProducto 
          closeModal={closeModal}
          onAddProduct={addNewProduct}
          colecciones={colecciones}
          ediciones={ediciones}
        />
      )}
      
      {isEditing && (
        <EditarProducto
          producto={selectedProduct}
          closeModal={closeModal}
          onSave={saveEditedProduct}
          colecciones={colecciones}
          ediciones={ediciones}
        />
      )}

      {isAddingStock && (
        <AgregarStock
          closeModal={closeModal}
          productos={productos}
          onAddStock={handleAddStock}
        />
      )}
    </div>
  );
}

export default Productos;