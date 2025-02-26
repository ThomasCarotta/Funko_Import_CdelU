import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function DetalleFunko() {
  const { idProducto } = useParams(); // Obtener el ID desde la URL
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const [preguntas, setPreguntas] = useState([]);
  const [nuevaPregunta, setNuevaPregunta] = useState("");
  const [respuestaPregunta, setRespuestaPregunta] = useState({});
  const [resenas, setResenas] = useState([]);
  const [nuevaResena, setNuevaResena] = useState({ resena: 5, comentario: "" });

  useEffect(() => {
    const handleStorageChange = () => {
      const email = localStorage.getItem("userEmail");
      setUserEmail(email);
      console.log("Storage cambiado. Nuevo email:", email); // Depuración
    };

    handleStorageChange();

    window.addEventListener("storage", handleStorageChange);

    // Limpiar el event listener al desmontarse el componente
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchResenas = async () => {
      try {
        const respuesta = await fetch(`http://localhost:8000/api/auth/obtener-resenas-producto/${idProducto}/`);
        if (!respuesta.ok) {
          throw new Error("Error al cargar las reseñas");
        }
        const data = await respuesta.json();
        setResenas(data);
      } catch (error) {
        console.error("Error al cargar las reseñas:", error);
      }
    };

    fetchResenas();
  }, [idProducto]);

  useEffect(() => {
    // Convertir idProducto a número
    const id = parseInt(idProducto, 10);

    // Validar que idProducto sea un número válido
    if (isNaN(id) || id <= 0) {
      console.error("ID de producto inválido:", id);
      setError("ID de producto inválido");
      setLoading(false);
      return;
    }

    const fetchProducto = async () => {
      try {
        // Usar 'id' en lugar de 'idProducto'
        const respuesta = await fetch(`http://localhost:8000/api/auth/obtener-detalle-producto/${id}/`);
        if (!respuesta.ok) {
          throw new Error("Producto no encontrado");
        }
        const data = await respuesta.json();
        setProducto(data);
      } catch (error) {
        console.error("Error al cargar el producto:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [idProducto]);

  // Cargar preguntas al montar el componente
  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const respuesta = await fetch(`http://localhost:8000/api/auth/obtener-preguntas-producto/${idProducto}/`);
        if (!respuesta.ok) {
          throw new Error("Error al cargar las preguntas");
        }
        const data = await respuesta.json();
        setPreguntas(data);
      } catch (error) {
        console.error("Error al cargar las preguntas:", error);
      }
    };

    fetchPreguntas();
  }, [idProducto]);

  const handleSubmitResena = async (e) => {
    e.preventDefault();
    if (!userEmail) {
      alert("Por favor, inicia sesión para hacer una reseña");
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:8000/api/auth/crear-resena/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: userEmail,
          idProducto: Number(producto.idProducto), // Convertir a número si es necesario
          resena: Number(nuevaResena.resena), // Asegurar que es un número
          comentario: nuevaResena.comentario.trim(), // Evitar espacios vacíos
        }),
      });

      if (!respuesta.ok) {
        throw new Error(await respuesta.text()); // Obtener mensaje de error
      }

      const data = await respuesta.json();
      setResenas([...resenas, data]);
      setNuevaResena({ resena: 5, comentario: "" });
      alert("Reseña enviada correctamente");
    } catch (error) {
      console.error("Error al enviar la reseña:", error);
      alert("Error al enviar la reseña: " + error.message);
    }
  };

  const handleAddToCart = async () => {
    if (!userEmail) {
      alert("Por favor, inicia sesión para añadir productos al carrito");
      return;
    }

    if (producto.cantidadDisp <= 0) {
      alert("No hay suficiente stock disponible para este producto.");
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:8000/api/auth/add-to-cart/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: userEmail,  // Asegúrate de enviar 'correo' y no 'user_token'
          idProducto: producto.idProducto,
          cantidad: 1, // Puedes ajustar la cantidad según sea necesario
        }),
      });

      const data = await respuesta.json();
      if (data.success) {
        alert("Producto añadido al carrito");
      } else {
        alert(data.message || "Error al añadir producto");
      }
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
      alert("Hubo un problema al añadir el producto");
    }
  };

  const handleSubmitPregunta = async (e) => {
    e.preventDefault();
    if (!userEmail) {
      alert("Por favor, inicia sesión para hacer una pregunta");
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:8000/api/auth/preguntas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pregunta: nuevaPregunta,
          idProducto: producto.idProducto,
          correo: userEmail, // Envía el correo del usuario
        }),
      });

      if (respuesta.ok) {
        const data = await respuesta.json();
        setPreguntas([...preguntas, data.pregunta]);
        setNuevaPregunta("");
        alert("Pregunta enviada correctamente");
      } else {
        alert("Error al enviar la pregunta");
      }
    } catch (error) {
      console.error("Error al enviar la pregunta:", error);
    }
  };

  const handleResponderPregunta = async (idPregunta) => {
    const respuesta = respuestaPregunta[idPregunta];
    if (!respuesta) {
      alert("Por favor, escribe una respuesta");
      return;
    }

    try {
      const respuestaApi = await fetch(`http://localhost:8000/api/auth/responder-pregunta/${idPregunta}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          respuesta: respuesta,
        }),
      });

      if (respuestaApi.ok) {
        const data = await respuestaApi.json();
        setPreguntas(preguntas.map(p => p.id_pregunta === idPregunta ? data.pregunta : p));
        setRespuestaPregunta({ ...respuestaPregunta, [idPregunta]: "" });
        alert("Respuesta enviada correctamente");
      } else {
        alert("Error al enviar la respuesta");
      }
    } catch (error) {
      console.error("Error al enviar la respuesta:", error);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!producto) return <p>Producto no encontrado.</p>;

  return (
    <div className="detalle-funko">
      <img
        src={`http://localhost:8000${producto.imagen}`}
        alt={producto.nombre}
        onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
      />
      <h2>{producto.nombre}</h2>
      <p>{producto.descripcion}</p>
      <p>
        Precio:{" "}
        {producto.precio_con_descuento && producto.porcentaje_descuento ? (
          <>
            <span style={{ textDecoration: "line-through", color: "red" }}>
              {producto.precio} USD
            </span>{" "}
            <strong>{producto.precio_con_descuento} USD</strong>
          </>
        ) : (
          <strong>{producto.precio} USD</strong>
        )}
      </p>
      {producto.porcentaje_descuento && (
        <div className="descuento-banner">
          ¡{producto.porcentaje_descuento}% de descuento!
        </div>
      )}
      <p>Cantidad disponible: {producto.cantidadDisp}</p>
      <p>{producto.esEspecial ? "Edición especial" : "Edición estándar"}</p>
      <button onClick={handleAddToCart}>Añadir al carrito</button>

      {/* Sección de preguntas y respuestas (existente) */}
      <div className="preguntas-respuestas" style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "20px" }}>
        <h3>Preguntas y respuestas</h3>

        {/* Formulario para hacer preguntas */}
        <form onSubmit={handleSubmitPregunta} style={{ marginBottom: "20px" }}>
          <textarea
            value={nuevaPregunta}
            onChange={(e) => setNuevaPregunta(e.target.value)}
            placeholder="Escribe tu pregunta aquí..."
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <button
            type="submit"
            style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Enviar pregunta
          </button>
        </form>

        {preguntas.length === 0 ? (
          <p>No hay preguntas para este producto.</p>
        ) : (
          preguntas.map((pregunta) => (
            <div key={pregunta.id_pregunta} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
              <p><strong>{pregunta.id_Usuario.nombre || pregunta.id_Usuario.correo}</strong>: {pregunta.pregunta}</p>
              {pregunta.respuesta ? (
                <p><strong>Respuesta:</strong> {pregunta.respuesta}</p>
              ) : (
                userEmail && (
                  <div>
                    <textarea
                      value={respuestaPregunta[pregunta.id_pregunta] || ""}
                      onChange={(e) => setRespuestaPregunta({ ...respuestaPregunta, [pregunta.id_pregunta]: e.target.value })}
                      placeholder="Escribe tu respuesta aquí..."
                      style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />
                    <button
                      onClick={() => handleResponderPregunta(pregunta.id_pregunta)}
                      style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
                    >
                      Responder
                    </button>
                  </div>
                )
              )}
            </div>
          ))
        )}
      </div>

      {/* Nueva sección de reseñas y comentarios */}
      <div className="resenas-comentarios" style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "20px" }}>
        <h3>Reseñas y comentarios</h3>

        {/* Formulario para hacer reseñas */}
        <form onSubmit={handleSubmitResena} style={{ marginBottom: "20px" }}>
          <label>
            Valoración:
            <select
              value={nuevaResena.resena}
              onChange={(e) => setNuevaResena({ ...nuevaResena, resena: e.target.value })}
            >
              {[1, 2, 3, 4, 5].map((valor) => (
                <option key={valor} value={valor}>{valor}</option>
              ))}
            </select>
          </label>
          <textarea
            value={nuevaResena.comentario}
            onChange={(e) => setNuevaResena({ ...nuevaResena, comentario: e.target.value })}
            placeholder="Escribe tu reseña aquí..."
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <button
            type="submit"
            style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Enviar reseña
          </button>
        </form>

        {/* Listado de reseñas */}
        {resenas.length === 0 ? (
          <p>No hay reseñas para este producto.</p>
        ) : (
          resenas.map((resena) => (
            <div key={resena.idResenaComentario} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
              <p><strong>{resena.idUsuario.nombre || resena.idUsuario.correo}</strong>: {resena.comentario}</p>
              <p>Valoración: {resena.resena} / 5</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DetalleFunko;