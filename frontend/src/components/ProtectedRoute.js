import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
