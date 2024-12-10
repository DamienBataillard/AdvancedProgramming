import { Box, Typography, Button } from '@mui/material';
import PrimarySearchAppBar from '../components/AppBar';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function Profil() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null); // State to store profile data
    const [loading, setLoading] = useState(true); // State to handle loading state
    console.log(profile)

    useEffect(() => {
        const verifyToken = async () => {
          try {
            const token = localStorage.getItem('token'); // Récupère le token depuis localStorage
            console.log(token)
            if (!token) {
              throw new Error('Token manquant');
            }
    
            const response = await fetch('http://localhost:5000/api/profil', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`, // En-tête Authorization avec le token
              },
            });
    
            if (!response.ok) {
              throw new Error('Accès interdit');
            }
    
            const data = await response.json();
            setProfile(data.profile)
            setLoading(false);
            console.log('Données du tableau de bord:', data);
          } catch (error) {
            console.error(error.message);
            navigate('/'); // Redirige vers la page de connexion si non autorisé
          }
        };
    
        verifyToken();
      }, [navigate]);
      console.log(profile)
    return(
        <div className="App">
            <PrimarySearchAppBar />
            <div className="profil-container">
                <Box>
                    {/* <img
                        src={profile.img_profile || 'https://via.placeholder.com/150'} // Default image if none provided
                        alt="Profil"
                        style={{ borderRadius: '50%', width: 150, height: 150 }}
                    /> */}
                     {/* <Typography variant="h5" sx={{ marginTop: 2 }}>
                        {profile.name_profile}
                    </Typography> */}
                </Box>
            </div>
        </div>
    );
}


export default Profil;