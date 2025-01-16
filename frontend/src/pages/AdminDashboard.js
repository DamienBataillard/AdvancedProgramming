import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import PrimarySearchAppBar from '../components/AppBar';
import { useEvaluations } from '../hooks/useEvaluations';
import { SurveyList } from '../components/SurveyList';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function AdminDashboard() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const { evaluations, loading: loadingEvals, error: errorEvals } = useEvaluations(null, userRole);
  const { t } = useTranslation();

  console.log("Evaluations récupérées :", evaluations);

  if (loadingEvals) return <p>Chargement des évaluations...</p>;
  if (errorEvals) return <p>Erreur : {errorEvals}</p>;

  const handleCreateSurvey = () => {
    navigate('/create-survey'); // Redirige vers la page SurveyCreation
  };

  return (
    <div className="App">
      <PrimarySearchAppBar />
      <div className="dashboard-container">
        <h1 className="title">{t('adminDashboard')}</h1>
        <h2 className="subtitle">{t('manageSurvey')}</h2>
      </div>
      <Box
        sx={{
          backgroundColor: '#5481c2',
          borderRadius: '10px',
          width: '80%',
          margin: 'auto',
          mt: '5%',
          mb: '5%',
          boxShadow: 3,
          padding: '20px',
        }}
      >
        <Typography variant="h5" gutterBottom>
          {t('listSurvey')}
        </Typography>
        <Button
          variant="contained"
          sx={{ mb: 2 }}
          onClick={handleCreateSurvey}
        >
          {t('createSurvey')}
        </Button>
        <SurveyList evaluations={evaluations} navigate={navigate} userRole="Admin" />
      </Box>
    </div>
  );
}

export default AdminDashboard;
