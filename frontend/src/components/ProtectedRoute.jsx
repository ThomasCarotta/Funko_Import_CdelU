import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isUserLoggedIn = !!sessionStorage.getItem("userEmail"); // Verifica si el usuario está logueado

  return isUserLoggedIn ? <Outlet /> : <Navigate to="/login" />; // Redirige al login si no está logueado
};

export default ProtectedRoute;