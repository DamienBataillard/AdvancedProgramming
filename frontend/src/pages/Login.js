import React, { useState } from 'react';
import '../index.css'; // Import du fichier CSS global
import logo from '../assets/images/logo.png'; // Import de l'image

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Simule l'envoi du formulaire
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Site Logo" className="site-logo" /> {/* Affiche le logo */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
