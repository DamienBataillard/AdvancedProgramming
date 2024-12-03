import { Box, Typography, Button } from '@mui/material';
import PrimarySearchAppBar from '../components/AppBar';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function StudentDashboard() {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [modules, setModules] = useState([]); // State pour les modules
  const [loadingEvaluations, setLoadingEvaluations] = useState(true);
  const [loadingModules, setLoadingModules] = useState(true); // Chargement des modules
  const [errorEvaluations, setErrorEvaluations] = useState('');
  const [errorModules, setErrorModules] = useState(''); // Erreur pour les modules

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

  // Récupérer les évaluations
  useEffect(() => {
    const fetchEvaluations = async () => {
      const studentId = localStorage.getItem('studentId'); // ID de l'étudiant connecté
      if (!studentId) {
        setErrorEvaluations('Aucun ID étudiant trouvé.');
        setLoadingEvaluations(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/evaluations/${studentId}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des évaluations.');
        }

        const data = await response.json();
        setEvaluations(data);
        setLoadingEvaluations(false);
      } catch (err) {
        setErrorEvaluations(err.message);
        setLoadingEvaluations(false);
      }
    };

    fetchEvaluations();
  }, []);

  // Récupérer les modules
  useEffect(() => {
    const fetchModules = async () => {
      const studentId = localStorage.getItem('studentId'); // ID de l’étudiant connecté
      if (!studentId) {
        setErrorModules('Aucun ID étudiant trouvé.');
        setLoadingModules(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/modules/${studentId}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des modules.');
        }

        const data = await response.json();
        setModules(data);
        setLoadingModules(false);
      } catch (err) {
        setErrorModules(err.message);
        setLoadingModules(false);
      }
    };

    fetchModules();
  }, []);

  if (loadingEvaluations || loadingModules)
    return <p>Chargement...</p>;
  if (errorEvaluations || errorModules)
    return <p>Erreur : {errorEvaluations || errorModules}</p>;

  return (
    <div className="App">
      <PrimarySearchAppBar />
      <div className="dashboard-container">
        <h1 className="title">Welcome to EFREI Feedbacks!</h1>
        <h2 className="subtitle">Give your thoughts</h2>
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '10px',
            width: '80%',
            margin: 'auto',
            mt: '5%',
            mb: '5%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 3,
            overflow: 'hidden',
            padding: '20px',
          }}
        >
          <Typography variant="h6" align="center" sx={{ mb: 3 }}>
            Available Surveys
          </Typography>

          {evaluations.length === 0 ? (
            <Typography variant="body1" align="center">
              No surveys available at the moment.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {evaluations.map((evaluation) => (
                <Box
                  key={evaluation.id_evaluation}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '5px',
                    padding: '10px 20px',
                    boxShadow: 2,
                  }}
                >
                  <Typography variant="subtitle1">{evaluation.title_evaluation}</Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2">
                      Open: {new Date(evaluation.date_opening).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      Close: {new Date(evaluation.date_closing).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/evaluation/${evaluation.id_evaluation}`)}
                  >
                    Start
                  </Button>
                </Box>
              ))}
            </Box>
          )}

          <Typography variant="h6" align="center" sx={{ mt: 5, mb: 3 }}>
            Modules
          </Typography>

          {modules.length === 0 ? (
            <Typography variant="body1" align="center">
              No modules available at the moment.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {modules.map((module) => (
                <Box
                  key={module.id_module}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '5px',
                    padding: '10px 20px',
                    boxShadow: 2,
                  }}
                >
                  <Typography variant="subtitle1">{module.name_module}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/module/${module.id_module}/comments`)}
                  >
                    View Feedbacks
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </div>
    </div>
  );
}

export default StudentDashboard;
