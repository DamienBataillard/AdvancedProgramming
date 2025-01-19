import { Box, Typography, Button, CircularProgress, TextField } from '@mui/material';
import PrimarySearchAppBar from '../components/AppBar';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import '../index.css';

function Profil() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null); // State to store profile data
    const [loading, setLoading] = useState(true); // State to handle loading state
    const [isDisabled, setIsDisabled] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState(null); // Store as dayjs object

    const handleProfil = async () => {
        if (isDisabled) {
            setIsDisabled(false); // Enable editing
        } else {
            try {
                const token = localStorage.getItem('token');
                const updatedProfile = {
                    first_name_profile: firstName,
                    last_name_profile: lastName,
                    mail_profile: email,
                    date_of_birth_profile: date ? dayjs(date).format('YYYY-MM-DD') : null,
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
                setProfile(data.profile); // Update profile state with new data
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
                setDate(dayjs(data.profile.date_of_birth_profile)); // Initialize with dayjs
                setLoading(false);
            } catch (error) {
                console.error(error.message);
                navigate('/'); // Redirect to login if unauthorized
            }
        };

        verifyToken();
    }, [navigate]);

    console.log(profile)
    return (
        <div className="App">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <PrimarySearchAppBar />
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CircularProgress />
                    </Box>
                ) : profile ? (
                    <div className="profil-container">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <h1 className="title">Welcome to your profile page!</h1>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                gap: 3,
                            }}
                        >
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
                            <DatePicker
                                label="Birth Date"
                                value={date} // Pass dayjs object
                                onChange={(newValue) => setDate(newValue)} // Update with dayjs object
                                disabled={isDisabled}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                            <Button variant="contained" color="primary" onClick={handleProfil}>
                                {isDisabled ? 'Modify' : 'Save'}
                            </Button>
                        </Box>
                    </div>
                ) : (
                    <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 5 }}>
                        Unable to load profile data.
                    </Typography>
                )}
            </LocalizationProvider>
        </div>
    );
}

export default Profil;
