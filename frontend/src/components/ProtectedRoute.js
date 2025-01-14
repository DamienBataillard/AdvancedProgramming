import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // Récupère le rôle depuis le localStorage

  if (!token) {
    // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirige vers une page "Non autorisé" si le rôle ne correspond pas
    return <Navigate to="/unauthorized" replace />;
  }

  return children; // Affiche les enfants si tout est validé
};

export default ProtectedRoute;
