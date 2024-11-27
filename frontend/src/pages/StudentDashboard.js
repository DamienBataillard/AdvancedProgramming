import { Box, Typography, Button } from '@mui/material';
import PrimarySearchAppBar from '../components/AppBar';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function StudentDashboard() {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]); // Nouveau state pour les feedbacks
  const [loadingEvaluations, setLoadingEvaluations] = useState(true);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [errorEvaluations, setErrorEvaluations] = useState('');
  const [errorFeedbacks, setErrorFeedbacks] = useState('');

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

  // Récupérer les feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      const studentId = localStorage.getItem('studentId'); // ID de l'étudiant connecté
      if (!studentId) {
        setErrorFeedbacks('Aucun ID étudiant trouvé.');
        setLoadingFeedbacks(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/feedbacks/${studentId}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des feedbacks.');
        }

        const data = await response.json();
        setFeedbacks(data);
        setLoadingFeedbacks(false);
      } catch (err) {
        setErrorFeedbacks(err.message);
        setLoadingFeedbacks(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loadingEvaluations || loadingFeedbacks) return <p>Chargement...</p>;
  if (errorEvaluations || errorFeedbacks)
    return <p>Erreur : {errorEvaluations || errorFeedbacks}</p>;

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
            Open Feedbacks
          </Typography>

          {feedbacks.length === 0 ? (
            <Typography variant="body1" align="center">
              No feedbacks available at the moment.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {feedbacks.map((feedback) => (
                <Box
                  key={feedback.id_feedback}
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
                  <Typography variant="subtitle1">{feedback.title_feedback}</Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2">
                      Created: {new Date(feedback.date_created).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/feedback/${feedback.id_feedback}`)}
                  >
                    View
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
