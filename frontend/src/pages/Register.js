import React, { useState } from 'react';
import '../index.css'; // Assure-toi d'importer le CSS global
import logo from '../assets/images/logo.png'; // Import du logo
import { Navigate, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    mail_profile: '',
    name_profile: '',
    date_of_birth_profile: '',
    password_profile: '',
    confirm_password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
  
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mail_profile: formData.mail_profile,
          name_profile: formData.name_profile,
          date_of_birth_profile: formData.date_of_birth_profile,
          password_profile: formData.password_profile,
        }),
      });
  
      // Vérifie si la réponse est OK (200-299)
      if (!response.ok) {
        const errorData = await response.json(); // Tente d'extraire les détails de l'erreur
        throw new Error(
          `Erreur HTTP ${response.status}: ${errorData.message || 'Une erreur est survenue'}`
        );
      }
  
      // Si la réponse est valide
      const data = await response.json();
      console.log('Utilisateur enregistré avec succès :', data);
      alert('Utilisateur enregistré avec succès !');
      navigate('/login');
    } catch (err) {
      // Affiche une erreur détaillée dans la console
      console.error('Erreur lors de l\'inscription :', err.message);
      alert(`Erreur : ${err.message}`); // Affiche un message utilisateur
    }
  };
  

  return (
    <div className="register-container">
      <img src={logo} alt="Site Logo" className="site-logo" /> {/* Affiche le logo */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="mail_profile"
          placeholder="Email"
          value={formData.mail_profile}
          onChange={handleChange}
        />
        <input
          type="text"
          name="name_profile"
          placeholder="Name"
          value={formData.name_profile}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date_of_birth_profile"
          placeholder="Date of Birth"
          value={formData.date_of_birth_profile}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password_profile"
          placeholder="Password"
          value={formData.password_profile}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          value={formData.confirm_password}
          onChange={handleChange}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default Register;
