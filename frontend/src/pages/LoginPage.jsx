import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import logoImage from "../assets/logo.png";
import "../HomePage.css"; 

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = (response) => {
    if (response?.credential) {
      console.log("Token recibido de Google:", response.credential);
  
      fetch("http://localhost:8000/api/auth/google-login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Respuesta del backend:", data);
  
          if (!data.user) {
            console.error("No se recibió un usuario válido desde el backend.");
            return;
          }
  
          sessionStorage.setItem("user_token", response.credential);
          sessionStorage.setItem("userEmail", data.user.email);
          sessionStorage.setItem("userName", data.user.name);

  
          // Redirigir según el rol y si es un nuevo usuario
          if (data.user.first_time) {
            navigate("/completar-perfil");
          } else {
            if (data.user.rol) {
              navigate("/admin");
            } else {
              navigate("/user");
            }
          }
        })
        .catch((error) => {
          console.error("Error al autenticar:", error);
        });
    } else {
      console.error("No se recibió el token de Google.");
    }
  };
  
  return (
    <div className="home-container-HP">
      {/* Logo */}
      <div className="logo-containerHP">
        <img src={logoImage} alt="Logo" className="logoHP" />
      </div>

      {/* Texto "Iniciar sesión" */}
      <h1 className="login-textHP">Iniciar sesión</h1>

      {/* Botón de Google */}
      <GoogleLogin 
        onSuccess={handleGoogleLogin} 
        onError={() => console.log("Error en login con Google")} 
        useOneTap
      />
    </div>
  );
};

export default LoginPage;