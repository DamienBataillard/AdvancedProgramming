import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIService } from '../services/apiService';
import { validateRegisterForm } from '../utils/FormValidator';
import '../index.css'; // Assurez-vous que ce fichier contient les styles globaux
import logo from '../assets/images/logo.png';

const Register = () => {
  const [formData, setFormData] = useState({
    mail_profile: '',
    name_profile: '',
    date_of_birth_profile: '',
    password_profile: '',
    confirm_password: '',
  });
  const [error, setErrors] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await APIService.register(formData);
      alert('Registration successful');
      navigate('/login');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="register-container">
      <img src={logo} alt="Site Logo" className="site-logo" />
      <form onSubmit={handleSubmit} className="register-form">
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
