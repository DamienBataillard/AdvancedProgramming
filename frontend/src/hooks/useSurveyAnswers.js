// hooks/useSurveyAnswers.js
import { useState, useEffect } from 'react';

export const useSurveyAnswers = (professorname, surveyId) => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/professor/${professorname}/survey/${surveyId}/answers`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des réponses.');
        }

        const data = await response.json();
        setAnswers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [professorname, surveyId]);

  return { answers, loading, error };
};
