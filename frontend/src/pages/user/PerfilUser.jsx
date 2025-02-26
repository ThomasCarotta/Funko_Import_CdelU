import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const PerfilUser = () => {
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: '',
    // ciudad: '',
    // provincia: '',
    // codigoPostal: '',
  });
  const [isPersonalInfoEditing, setIsPersonalInfoEditing] = useState(false);
  const [isShippingInfoEditing, setIsShippingInfoEditing] = useState(false);
  const navigate = useNavigate();

  // Obtener el token de autenticación y los datos del usuario al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
  
    console.log("Email desde localStorage:", email); // 🔍 Verifica qué email se está usando
  
    if (!token || !email) {
      navigate('/login');
      return;
    }
  
    fetch(`http://localhost:8000/api/auth/user-data/?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Datos recibidos del backend:", data); // 🔍 Verificar qué usuario se recibe
        if (data.user) {
          setUserData(data.user);
        } else {
          console.error('No se encontraron datos del usuario.');
        }
      })
      .catch((error) => {
        console.error('Error al obtener los datos del usuario:', error);
      });
  }, [navigate, isPersonalInfoEditing, isShippingInfoEditing]);

  // Función para guardar los cambios en la información personal
  const handleSavePersonalInfo = () => {
    const token = localStorage.getItem('token');
  
    fetch('http://localhost:8000/api/auth/update-profile/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre: userData.nombre,
        apellido: userData.apellido,
        telefono: userData.telefono,
        correo: userData.correo,  // Asegurar que se usa el correo del estado y no localStorage
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Perfil actualizado correctamente') {
          setIsPersonalInfoEditing(false);
          alert('Información personal actualizada correctamente.');
        } else {
          console.error('Error al actualizar la información personal.', data);
        }
      })
      .catch((error) => {
        console.error('Error al guardar los cambios:', error);
      });
  };
  
  

  // Función para guardar los cambios en la información de envío
  const handleSaveShippingInfo = () => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:8000/api/auth/update-profile/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        correo: localStorage.getItem('userEmail'),
        direccion: userData.direccion,
        // ciudad: userData.ciudad,
        // provincia: userData.provincia,
        // codigoPostal: userData.codigoPostal,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Perfil actualizado correctamente') {
          setIsShippingInfoEditing(false);
          alert('Información de envío actualizada correctamente.');
        } else {
          console.error('Error al actualizar la información de envío.');
        }
      })
      .catch((error) => {
        console.error('Error al guardar los cambios:', error);
      });
  };

  return (
    <div className="perfil-containerUSER">
      <header className="header-profileUSER">
        <button className="btn-backUSER" onClick={() => navigate('/user')}>Volver</button>
        <h1 className="text-centerMPUSER text-2xl font-semibold mb-6">Mi Perfil</h1>
      </header>
      
      {/* Información Personal */}
      <div className="info-sectionUSER">
        <h2 className="section-titleUSER">Información Personal</h2>
        <p>Actualiza tu información personal aquí.</p>
        {isPersonalInfoEditing ? (
          <div className="edit-formUSER">
            <input
              type="text"
              placeholder="Nombre"
              value={userData.nombre}
              onChange={(e) => setUserData({ ...userData, nombre: e.target.value })}
              className="input-fieldUSER"
            />
            <input
              type="text"
              placeholder="Apellido"
              value={userData.apellido}
              onChange={(e) => setUserData({ ...userData, apellido: e.target.value })}
              className="input-fieldUSER"
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={userData.correo}
              disabled
              className="input-fieldUSER"
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={userData.telefono}
              onChange={(e) => setUserData({ ...userData, telefono: e.target.value })}
              className="input-fieldUSER"
            />
            <button className="btn-saveUSR" onClick={handleSavePersonalInfo}>
              Guardar Cambios
            </button>
          </div>
        ) : (
          <div>
            <p>
              <strong>Nombre:</strong> {userData.nombre} {userData.apellido}
            </p>
            <p>
              <strong>Correo electrónico:</strong> {userData.correo}
            </p>
            <p>
              <strong>Teléfono:</strong> {userData.telefono}
            </p>
            <button className="btn-editUSER" onClick={() => setIsPersonalInfoEditing(true)}>
              Editar Información
            </button>
          </div>
        )}
      </div>

      {/* Información de Envío */}
      <div className="info-sectionUSER">
        <h2 className="section-titleUSER">Datos del Envío</h2>
        <p>Gestiona tu dirección de envío predeterminada.</p>
        {isShippingInfoEditing ? (
          <div className="edit-formUSER">
            <input
              type="text"
              placeholder="Calle y Número"
              value={userData.direccion}
              onChange={(e) => setUserData({ ...userData, direccion: e.target.value })}
              className="input-fieldUSER"
            />
            {/* <input
              type="text"
              placeholder="Ciudad"
              value={userData.ciudad}
              onChange={(e) => setUserData({ ...userData, ciudad: e.target.value })}
              className="input-fieldUSER"
            />
            <input
              type="text"
              placeholder="Provincia"
              value={userData.provincia}
              onChange={(e) => setUserData({ ...userData, provincia: e.target.value })}
              className="input-fieldUSER"
            />
            <input
              type="text"
              placeholder="Código Postal"
              value={userData.codigoPostal}
              onChange={(e) => setUserData({ ...userData, codigoPostal: e.target.value })}
              className="input-fieldUSER"
            /> */}
            <button className="btn-saveUSER" onClick={handleSaveShippingInfo}>
              Guardar Dirección
            </button>
          </div>
        ) : (
          <div>
            <p>
              <strong>Calle:</strong> {userData.direccion}
            </p>
            {/* <p>
              <strong>Ciudad:</strong> {userData.ciudad}
            </p>
            <p>
              <strong>Provincia:</strong> {userData.provincia}
            </p>
            <p>
              <strong>Código Postal:</strong> {userData.codigoPostal}
            </p> */}
            <button className="btn-editUSER" onClick={() => setIsShippingInfoEditing(true)}>
              Editar Dirección
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilUser;