import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EvaluationForm from './pages/EvaluationForm'; // Import du composant

function App() {
  return (
    <Router>
      <Routes>
        {/* Définir la page par défaut */}
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/evaluation/:id" element={<EvaluationForm />} />
      </Routes>
    </Router>
  );
}

export default App;

