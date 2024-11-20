import { Box, Typography } from '@mui/material';
import PrimarySearchAppBar from '../components/AppBar'
import logo from '../assets/images/logo.png';
import '../index.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('token'); // Récupère le token depuis localStorage
        if (!token) {
          throw new Error('Token manquant');
        }

        const response = await fetch('http://localhost:5000/api/dashboard', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // En-tête Authorization avec le token
          },
        });

        if (!response.ok) {
          throw new Error('Accès interdit');
        }

        const data = await response.json();
        console.log('Données du tableau de bord:', data);
      } catch (error) {
        console.error(error.message);
        navigate('/'); // Redirige vers la page de connexion si non autorisé
      }
    };

    verifyToken();
  }, [navigate]);
  return (
    <div className="App">
      <PrimarySearchAppBar />
      <div className='dashboard-container'>
      
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '10px',
            width: '80%',
          
            margin: 'auto',
            mt: '5%',
            mb:'5%',
            display: 'flex',
            boxShadow: 3,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              borderRight: '1px solid black',
            }}
          >
            <Typography variant="h6">Available Surveys</Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6">Open Feedbacks</Typography>
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default StudentDashboard;