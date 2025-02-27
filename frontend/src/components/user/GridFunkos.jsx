
import React, { useEffect, useState } from "react";
import FunkoCard from "../user/FunkoCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import banner from "../../assets/banner.jpg";

function GridFunkos({ searchTerm }) {
  const [productos, setProductos] = useState([]);
  const [sortedProductos, setSortedProductos] = useState([]);
  const [filterOption, setFilterOption] = useState("all");
  const [colecciones, setColecciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const respuesta = await fetch("http://localhost:8000/api/auth/obtener-productos/");
        const data = await respuesta.json();
        setProductos(data);
        setSortedProductos(data);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchColecciones = async () => {
      try {
        const respuesta = await fetch("http://localhost:8000/api/auth/obtener-colecciones/");
        const data = await respuesta.json();
        setColecciones(data);
      } catch (error) {
        console.error("Error al cargar las colecciones:", error);
      }
    };
    fetchColecciones();
  }, []);

  const filteredProductos = sortedProductos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const otrosProductos = filteredProductos.length > 0 ? filteredProductos : [];

  const sortProductos = (type) => {
    let sorted = [...filteredProductos];
    if (type === "priceAsc") sorted.sort((a, b) => a.precio - b.precio);
    if (type === "priceDesc") sorted.sort((a, b) => b.precio - a.precio);
    if (type === "nameAsc") sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
    if (type === "nameDesc") sorted.sort((a, b) => b.nombre.localeCompare(a.nombre));
    setSortedProductos(sorted);
  };

  const filterProductos = (collection) => {
    if (collection === "all") {
      setSortedProductos(productos);
    } else {
      const filtrado = productos.filter((producto) => String(producto.idColeccion) === String(collection));
      setSortedProductos(filtrado);
    }
    setFilterOption(collection);
  };

  return (
    <div className="grid-container">
      {/* Carrusel de imágenes promocionales */}
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="swiper-container"
      >
        <SwiperSlide>
          <img src={banner} alt="Promoción 1" className="banner-image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/banner2.jpg" alt="Promoción 2" className="banner-image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/banner3.jpg" alt="Promoción 3" className="banner-image" />
        </SwiperSlide>
      </Swiper>

      <div className="nuestros-prod">
        <p>Nuestros productos</p>
      </div>

      <div className="filters">
        <span>Ordenar por: </span>
        <button onClick={() => sortProductos("nameAsc")}>A - Z</button>
        <button onClick={() => sortProductos("nameDesc")}>Z - A</button>
        <button onClick={() => sortProductos("priceAsc")}>Menor Precio</button>
        <button onClick={() => sortProductos("priceDesc")}>Mayor Precio</button>
        <select onChange={(e) => filterProductos(e.target.value)} value={filterOption}>
          <option value="all">Todas las Colecciones</option>
          {colecciones.map((col) => (
            <option key={col.idColeccion} value={col.idColeccion}>
              {col.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="funkos-grid">
        {otrosProductos.length > 0 ? (
          otrosProductos.map((producto) => <FunkoCard key={producto.idProducto} producto={producto} />)
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default GridFunkos;
