import { Box, Typography, Button, CircularProgress, TextField} from '@mui/material';
import PrimarySearchAppBar from '../components/AppBar';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateField } from '@mui/x-date-pickers/DateField';

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
      return (
        <div className="App">
            <PrimarySearchAppBar />
            {loading ? (
                // Render spinner while loading
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            ) : profile ? (
                // Render profile if loaded successfully
                <div className="profil-container">
                    <Box sx={ {display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        {/* <img
                            src={profile.img_profile || 'https://via.placeholder.com/150'}
                            alt="Profile"
                            style={{ borderRadius: '50%', width: 300, height: 300 }}
                        /> */}
                        <TextField

                          defaultValue={profile.name_profile}
                          disabled
                        />
                        <TextField
                          defaultValue={profile.mail_profile}
                          disabled
                        />
                        <Typography variant="h5" sx={{ marginTop: 2 }}>
                            {profile.name_profile || 'Name not available'}
                        </Typography>
                        {/* <DateField
                            value={profile.date_of_birth_profile}
                        /> */}
                    </Box>
                </div>
            ) : (
                // Render fallback message if profile is null
                <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 5 }}>
                    Unable to load profile data.
                </Typography>
            )}
        </div>
    );
}


export default Profil;