import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';

const CompletarPerfil = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("user_token");
    const email = sessionStorage.getItem("userEmail");

    try {
      const res = await fetch("http://localhost:8000/api/auth/completar-perfil/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          correo: email,
          nombre: formData.nombre,
          apellido: formData.apellido,
          direccion: formData.direccion,
          telefono: formData.telefono
        }),
      });

      // Verifica si la respuesta no es exitosa
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al completar el perfil");
      }

      const data = await res.json();

      // Verifica el mensaje de éxito
      if (data.message === "Perfil actualizado correctamente") {
        // Redirigir al usuario después de completar su perfil
        sessionStorage.setItem("userName", formData.nombre);
        navigate("/user");
      } else {
        throw new Error("Error inesperado al completar el perfil");
      }

    } catch (error) {
      console.error("Error:", error);
      alert(error.message); // Muestra el error al usuario
    }
  };

  return (
    <div className="modal-overlayCP">
      <div className="modalCP">
        <h2>Completa tu perfil</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
          <input type="text" name="apellido" placeholder="Apellido" onChange={handleChange} required />
          <input type="text" name="direccion" placeholder="Dirección" onChange={handleChange} required />
          <input type="tel" name="telefono" placeholder="Teléfono" onChange={handleChange} required />
          <button type="submit">Guardar</button>
        </form>
      </div>
    </div>
  );
};

export default CompletarPerfil;