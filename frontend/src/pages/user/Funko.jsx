import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { obtenerDetalleFunko } from '../../utils/api';
import DetalleFunko from '../../components/user/DetalleFunko';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';

const Funko = () => {
  const { id } = useParams();
  const [funko, setFunko] = useState(null);
  const [reseñas, setReseñas] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState({texto: ''});

  useEffect(() => {
    const cargarFunko = async () => {
      const data = await obtenerDetalleFunko(id);
      setFunko(data);

      setReseñas([
        { id: 1, autor: 'Juan', texto: 'Increíble detalle', rating: 5 },
        { id: 2, autor: 'Maria', texto: 'Muy bonito', rating: 4 },
      ]);
    };

    cargarFunko();
  }, [id]);

  const agregarComentario = (e) => {
    e.preventDefault();
    const nuevo = {
      id: reseñas.length + 1,
      texto: nuevoComentario.texto,
    };
  };

  return (
    <>
      <Header />

      <div className="contenido">
        <DetalleFunko funko={funko} />

        {/* <div className="reseñas">
          <h2>Reseñas y Comentarios</h2>
          {reseñas.length > 0 ? (
            reseñas.map((review) => (
              <div key={review.id} className="comentario">
                <p><strong>{review.autor}</strong>: {review.texto}</p>
                <p>Calificación: {review.rating} ⭐</p>
              </div>
            ))
          ) : (
            <p>No hay reseñas aún.</p>
          )}

          <form onSubmit={agregarComentario} className="formulario-comentario">
            <input
              type="text"
              placeholder="Agregar comentario.."
              value={nuevoComentario.autor}
              onChange={(e) => setNuevoComentario({ ...nuevoComentario,})}
              required
            />
            <button type="submit">Enviar</button>
          </form>
        </div> */}
      </div>

      <Footer />
    </>
  );
};

export default Funko;