import React, { useState } from 'react';
import '../index.css'; // Assurez-vous que votre CSS est bien importé
import logo from '../assets/images/logo.png'; // Import du logo
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    mail_profile: '',
    password_profile: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Hook pour naviguer entre les pages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la connexion.');
      }

      const data = await response.json();
      setSuccess(`Bienvenue ${data.user.name_profile}`);
      setError('');
      localStorage.setItem('token', data.token); // Stocke le token dans localStorage
      // Redirection vers la page StudentDashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Site Logo" className="site-logo" /> {/* Affiche le logo */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="mail_profile"
          placeholder="Email"
          value={formData.mail_profile}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password_profile"
          placeholder="Password"
          value={formData.password_profile}
          onChange={handleChange}
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
