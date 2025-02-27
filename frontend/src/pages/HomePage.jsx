import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png";
import "../HomePage.css"; 

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      // Si ya hay sesión, ir directamente a la vista de usuario
      navigate("/user");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="text-center">
        <img src={logoImage} alt="Logo" className="w-40 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-6">Bienvenido</h1>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg" 
          onClick={() => navigate("/login")}
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
};

export default HomePage;