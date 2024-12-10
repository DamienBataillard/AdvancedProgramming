import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EvaluationForm from './pages/EvaluationForm'; 
import FeedbackPage from './pages/FeedbackPage';
import AdminUserList from './pages/AdminUserList';
import Profil from "./pages/Profil";
import SurveyCreation from './pages/SurveyCreation';

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
        <Route path="/module/:moduleId/comments" element={<FeedbackPage />} />
        <Route path="/admin/users" element={<AdminUserList />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/survey-creation" element={<SurveyCreation />} />
      </Routes>
    </Router>
  );
}

export default App;

