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

    try {
      const data = await loginUser(formData);
      setMessage({ type: 'success', text: `Bienvenue ${data.user.name_profile}` });
      localStorage.setItem('token', data.token); // Stocke le token
      localStorage.setItem('studentId', data.user.id); // Stocke l'ID utilisateur
      navigate('/dashboard') 
    } catch (err) {
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
    </div>
  );
};

export default Login;
