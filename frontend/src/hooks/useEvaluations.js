// hooks/useEvaluations.js
import { useState, useEffect } from 'react';
import { fetchEvaluations } from '../services/apiService';

export const useEvaluations = (studentId) => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvaluations = async () => {
      try {
        const data = await fetchEvaluations(studentId);
        setEvaluations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEvaluations();
  }, [studentId]);

  return { evaluations, loading, error };
};
