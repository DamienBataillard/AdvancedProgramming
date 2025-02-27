import React, { useState } from 'react';
import '../index.css'; // Assurez-vous que votre CSS est bien importé
import logo from '../assets/images/logo.png'; // Import du logo
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/apiService'; // Import du service d'API

const Login = () => {
  const [formData, setFormData] = useState({
    mail_profile: '',
    password_profile: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Données du formulaire :', formData);

    try {
      const data = await loginUser(formData);
      console.log('Connexion réussie, données reçues :', data);

      setMessage({ type: 'success', text: `Bienvenue ${data.user.name_profile}` });
      localStorage.setItem('token', data.token); // Stocke le token
      localStorage.setItem('userId', data.user.id_profile); // Stocke l'ID utilisateur
      localStorage.setItem('role', data.user.role);
      console.log('Token sauvegardé :', localStorage.getItem('token'));

      // Redirection en fonction du rôle
      if (data.user.role === 'Student') {
        navigate('/dashboard'); // Page du tableau de bord étudiant
      } else if (data.user.role === 'Teacher') {
        localStorage.setItem('professorname', data.user.name_profile);
        navigate('/professor-dashboard'); // Page du tableau de bord professeur
      } else if (data.user.role === 'Admin') {
        navigate('/admin-dashboard'); // Page du tableau de bord administrateur
      } else {
        setMessage({ type: 'error', text: 'Rôle utilisateur non reconnu.' });
      }
    } catch (err) {
      console.error('Erreur lors de la connexion :', err.message);
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Site Logo" className="site-logo" />
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
        <button type="submit">Login</button>
      </form>
      {message.text && (
        <p className={`message ${message.type}`}>{message.text}</p>
      )}
    </div>
  );
};

export default Login;
