import React from 'react';
import { Box } from '@mui/material';
import PrimarySearchAppBar from '../components/AppBar';
import { useEvaluations } from '../hooks/useEvaluations';
import { useModules } from '../hooks/useModules';
import { SurveyList } from '../components/SurveyList';
import { ModuleList } from '../components/ModuleList';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function StudentDashboard() {
  const navigate = useNavigate();
  const studentId = localStorage.getItem('userId');
  const { evaluations, loading: loadingEvals, error: errorEvals } = useEvaluations(studentId);
  const { modules, loading: loadingMods, error: errorMods } = useModules(studentId);
  const { t } = useTranslation();

  if (loadingEvals || loadingMods) return <p>Chargement...</p>;
  if (errorEvals || errorMods) return <p>Erreur : {errorEvals || errorMods}</p>;

  return (
    <div className="App">
      <PrimarySearchAppBar />
      <div className="dashboard-container">
        <h1 className="title">{t('welcome')}</h1>
        <h2 className="subtitle">{t('subtitle')}</h2>
      </div>
      <Box
        sx={{
          backgroundColor: '#5481c2',
          display: 'flex',
          justifyContent: 'space-between',
          borderRadius: '10px',
          width: '80%',
          margin: 'auto',
          mt: '5%',
          mb: '5%',
          boxShadow: 3,
          padding: '20px',
        }}
      >
        <SurveyList evaluations={evaluations} navigate={navigate} userRole="Student"/>
        <ModuleList modules={modules} navigate={navigate} />
      </Box>
    </div>
  );
}

export default StudentDashboard;
