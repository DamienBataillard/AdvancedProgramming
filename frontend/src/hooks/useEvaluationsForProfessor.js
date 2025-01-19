import { useState, useEffect } from 'react';

export const useEvaluationsForProfessor = (professorname) => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvaluations = async () => {
      console.log('Fetching evaluations for professor:', professorname);

      if (!professorname) {
        console.error('Professor name is undefined or null.');
        setError('Professor name is required.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing. User might not be authenticated.');
        setError('Authentication token is required.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/professor/${professorname}/evaluations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error from server:', errorData.message || 'Unknown error.');
          throw new Error(errorData.message || 'Failed to fetch evaluations.');
        }

        const data = await response.json();
        console.log('Fetched evaluations:', data);
        setEvaluations(data);
      } catch (err) {
        console.error('Error while fetching evaluations:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [professorname]);

  return { evaluations, loading, error };
};
