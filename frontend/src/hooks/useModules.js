// hooks/useModules.js
import { useState, useEffect } from 'react';
import { fetchModules } from '../services/apiService';

export const useModules = (studentId) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadModules = async () => {
      try {
        const data = await fetchModules(studentId);
        setModules(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [studentId]);

  return { modules, loading, error };
};
