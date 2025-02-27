import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CompletarPerfil from "./pages/CompletarPerfil";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin
import HeaderAdmin from "./components/admin/HeaderAdmin";
import AdminHome from "./pages/admin/AdminHome";
import Productos from "./pages/admin/Productos";
import Categorias from "./pages/admin/Categorias";
import Pedidos from "./pages/admin/Pedidos";
import Edicion from "./pages/admin/Edicion";
// import Perfil from "./pages/admin/AdPerfil";
import Descuentos from "./pages/admin/Descuentos";
import Promociones from "./pages/admin/Promociones";
import VentasAdmin from "./pages/admin/VentasAdmin";

// User
import UserHome from "./pages/user/UserHome";
import Funko from "./pages/user/Funko";
import Cart from "./pages/user/Cart";
import Favorites from "./pages/user/Favorites";
import PerfilUser from "./pages/user/PerfilUser";
import ShippingMethod from "./components/user/ShippingMethod";
import PaymentMethod from "./components/user/PaymentMethod";
import PaymentStatus from "./components/user/PaymentStatus";
import DetalleFunko from "./components/user/DetalleFunko";
import MisCompras from "./pages/user/MisCompras";


function App() {
  return (
    <Router>
      <Routes>
        {/* Al ingresar a la página, redirigir automáticamente a la vista de usuario */}
        <Route path="/" element={<Navigate to="/user" />} />

        {/* Página de inicio de sesión */}
        <Route path="/login" element={<LoginPage />} />

        {/* Página para completar el perfil */}
        <Route path="/completar-perfil" element={<CompletarPerfil />} />

        {/* Rutas del Administrador */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="productos" element={<Productos />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="edicion" element={<Edicion />} />
          {/* <Route path="perfil" element={<Perfil />} /> */}
          <Route path="descuento" element={<Descuentos />} />
          <Route path="promocion" element={<Promociones />} />
          <Route path="*" element={<Navigate to="/admin" />} />
          <Route path="/admin/ventas" element={<VentasAdmin />} />

        </Route>

        {/* Rutas del Usuario */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserHome />} />
          <Route path="funko/:idProducto" element={<Funko />} />
          <Route element={<ProtectedRoute />}>
            <Route path="carrito" element={<Cart />} />
            <Route path="favorites" element={<Favorites />} />
          </Route>
          <Route path="perfil" element={<PerfilUser />} />
          {/* <Route path="shipping" element={<ShippingMethod />} /> */}
          <Route path="detalle/:idProducto" element={<DetalleFunko />} />
          <Route path="MisCompras" element={<MisCompras />} />

          {/* Rutas para manejar los estados de pago */}
          <Route path="success" element={<PaymentStatus status="success" />} />
          <Route path="failure" element={<PaymentStatus status="failure" />} />
          <Route path="pending" element={<PaymentStatus status="pending" />} />

          <Route path="*" element={<Navigate to="/user" />} />
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/user" />} />
      </Routes>
    </Router>
  );
}

// Layout del Administrador
function AdminLayout() {
  return (
    <div>
      <HeaderAdmin />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

// Layout del Usuario
function UserLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default App;
