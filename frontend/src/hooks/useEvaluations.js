import { useState, useEffect } from 'react';
import { fetchEvaluations, fetchAllEvaluations } from '../services/apiService';

export const useEvaluations = (userId, userRole) => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvaluations = async () => {
      try {
        const data = userRole === 'Admin'
          ? await fetchAllEvaluations() // Récupérer toutes les évaluations
          : await fetchEvaluations(userId); // Récupérer uniquement celles du user
        setEvaluations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEvaluations();
  }, [userId, userRole]);

  return { evaluations, loading, error };
};
