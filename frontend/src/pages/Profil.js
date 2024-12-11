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
    const [isDisabled, setIsDisabled] = useState(true);
    console.log(profile)

    // Local state for form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const handleProfil = async () => {
        if (isDisabled) {
            // Enable editing
            setIsDisabled(false);
        } else {
            // Save changes to the backend
            try {
                const token = localStorage.getItem('token');
                const updatedProfile = {
                    first_name_profile: firstName,
                    last_name_profile: lastName,
                    mail_profile: email,
                };

                const response = await fetch('http://localhost:5000/api/profil', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedProfile),
                });

                if (!response.ok) {
                    throw new Error('Failed to update profile');
                }

                const data = await response.json();
                setProfile(data.profile); // Update the profile state with the new data
                setIsDisabled(true); // Disable editing
            } catch (error) {
                console.error('Error updating profile:', error.message);
            }
        }
    };

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token missing');
                }

                const response = await fetch('http://localhost:5000/api/profil', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Access denied');
                }

                const data = await response.json();
                setProfile(data.profile);
                setFirstName(data.profile.first_name_profile);
                setLastName(data.profile.last_name_profile);
                setEmail(data.profile.mail_profile);
                setLoading(false);
            } catch (error) {
                console.error(error.message);
                navigate('/'); // Redirect to login if unauthorized
            }
        };

        verifyToken();
    }, [navigate]);

      console.log(profile)
      console.log(isDisabled)
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
                  <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <h1 className="title">Welcome to your profil page !</h1>
                  </Box>
                    <Box sx={ {display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 3}}>
                        {/* <img
                            src={profile.img_profile || 'https://via.placeholder.com/150'}
                            alt="Profile"
                            style={{ borderRadius: '50%', width: 300, height: 300 }}
                        /> */}
                        <TextField
                          label="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          disabled={isDisabled}
                        />
                        <TextField
                          label="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          disabled={isDisabled}
                        />
                        <TextField
                          label="Mail"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isDisabled}
                        />
                        {/* <DateField
                            value={profile.date_of_birth_profile}
                        /> */}
                    </Box>
                    <Box className="profil-container" sx={{display: 'flex', justifyContent: 'center',top: '10px'}}>
                    
                      <button onClick={handleProfil}>Modify</button>
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