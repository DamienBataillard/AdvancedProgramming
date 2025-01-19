import React from 'react';
import { Box } from '@mui/material';
import PrimarySearchAppBar from '../components/AppBar';
import { useEvaluationsForProfessor } from '../hooks/useEvaluationsForProfessor';
import { useModulesForProfessor} from '../hooks/useModulesForProfessor';
import { SurveyList } from '../components/SurveyList';
import { ModuleList } from '../components/ModuleList';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function ProfessorDashboard() {
  const navigate = useNavigate();
  const professorname = localStorage.getItem('professorname'); 
  const { evaluations, loading: loadingEvals, error: errorEvals } = useEvaluationsForProfessor(professorname);
  const { modules, loading: loadingMods, error: errorMods  } = useModulesForProfessor(professorname);
  const { t } = useTranslation();
  
  if (loadingEvals || loadingMods) return <p>Loading...</p>;
  if (errorEvals || errorMods) return <p>Error: {errorEvals || errorMods}</p>;

  return (
    <div className="App">
      <PrimarySearchAppBar />
      <div className="dashboard-container">
        <h1 className="title">{t('teacherDashboard')}</h1>
        <h2 className="subtitle">{t('manageSurveyTeacher')}</h2>
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
        <SurveyList evaluations={evaluations} navigate={navigate} userRole="Teacher" professorname={professorname}/>
        <ModuleList modules={modules} navigate={navigate} />
      </Box>
    </div>
  );
}

export default ProfessorDashboard;
