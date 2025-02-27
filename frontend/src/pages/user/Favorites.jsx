import React, { useState, useEffect } from 'react';
import FunkoCard from '../../components/user/FunkoCard';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';
import '../../App.css';

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  // Cargar favoritos desde sessionStorage al montar el componente
  useEffect(() => {
    const storedFavorites = JSON.parse(sessionStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  return (
    <div>
      <Header />
      <div className="grid-container">
        <div className="nuestros-prod">
          <p>Mis favoritos</p>
        </div>

        {/* Grilla de favoritos */}
        <div className="funkos-grid">
          {favorites.length > 0 ? (
            favorites.map((producto) => (
              <FunkoCard key={producto.idProducto} producto={producto} />
            ))
          ) : (
            <p>No tienes funkos en favoritos.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Favorites;