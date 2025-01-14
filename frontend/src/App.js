import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import StudentDashboard from "./pages/StudentDashboard";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EvaluationForm from './pages/EvaluationForm'; 
import FeedbackPage from './pages/FeedbackPage';
import AdminUserList from './pages/AdminUserList';
import Profil from "./pages/Profil";
import SurveyCreation from './pages/SurveyCreation';
import AdminGroupCreation from './pages/AdminGroupCreation';
import ProtectedRoute from './components/ProtectedRoute'; // Import du composant ProtectedRoute

function App() {
  return (
    <Router>
      <Routes>
        {/* Définir la page par défaut */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Routes protégées */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRole="Student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/professor-dashboard" 
          element={
            <ProtectedRoute requiredRole="Teacher">
              <ProfessorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/evaluation/:id" 
          element={
            <ProtectedRoute>
              <EvaluationForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/module/:moduleId/comments" 
          element={
            <ProtectedRoute>
              <FeedbackPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute requiredRole="Admin">
                <AdminUserList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/groups" 
          element={
            <ProtectedRoute requiredRole="Admin">
                <AdminGroupCreation />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profil" 
          element={
            <ProtectedRoute>
              <Profil />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/survey-creation" 
          element={
            <ProtectedRoute>
              <SurveyCreation />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
