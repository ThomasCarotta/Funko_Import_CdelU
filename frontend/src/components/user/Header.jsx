import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "../../App.css";

const Header = ({ setSearchTerm }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  let timeoutId = null; // Variable para manejar el temporizador

  const isUserLoggedIn = !!sessionStorage.getItem("user_token");
  const userName = sessionStorage.getItem("userName");
  ;


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user_token");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userName");
    navigate("/login");
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutId); // Evita que se cierre si el usuario entra nuevamente
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 2000); // Se cierra después de 2 segundos
  };

  return (
    <header className="headerUS bg-blue-800 text-white flex items-center p-4 relative">
      {/* Barra de búsqueda */}
      <div className="search-barUS flex-1 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="search-inputUS w-full max-w-xs p-2 rounded-md"
          onChange={handleSearch}
        />
      </div>

      {/* Logo centrado */}
      <div className="logo-containerUS absolute left-1/2 transform -translate-x-1/2 text-center">
        <img src={logo} alt="Logo Mi Tienda" className="logo-imageUS h-16" />
      </div>

      {/* Menú y carrito */}
      <div className="menu-cartUS flex-1 flex justify-end space-x-4">
        <Link to="/user">
          <button className="menu-btnUS text-white font-bold">Inicio</button>
        </Link>

        {/* Mostrar carrito solo si está logueado */}
        {isUserLoggedIn && (
          <Link to="/user/carrito">
            <button className="cart-btnUS text-white font-bold">
              <i className="fas fa-shopping-cart"></i> Carrito
            </button>
          </Link>
        )}

        {/* Mostrar favoritos solo si está logueado */}
        {isUserLoggedIn && (
          <Link to="/user/favorites">
            <button className="cart-btnUS text-white font-bold">
              <i className="fas fa-heart"></i> Favoritos
            </button>
          </Link>
        )}

        {/* Ícono de usuario con menú desplegable */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className="user-iconUS text-white font-bold">
            <i className="fas fa-user"></i>{" "}
            {isUserLoggedIn ? userName : "Iniciar sesión"}
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menuUS">
              {isUserLoggedIn && (
                <Link to="/user/perfil" className="dropdown-itemUS">
                  Mi Perfil
                </Link>
              )}

              {isUserLoggedIn && (
                <Link to="/user/miscompras" className="dropdown-itemUS">
                  Mis Compras
                </Link>
              )}

              {isUserLoggedIn ? (
                <button onClick={handleLogout} className="dropdown-itemUS">
                  Cerrar Sesión
                </button>
              ) : (
                <Link to="/login" className="dropdown-itemUS">
                  Iniciar Sesión
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;