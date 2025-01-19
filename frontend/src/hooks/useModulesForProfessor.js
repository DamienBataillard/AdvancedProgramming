import { useState, useEffect } from 'react';

export const useModulesForProfessor = (professorname) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/professor/${professorname}/modules`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch modules.');
        }

        const data = await response.json();
        setModules(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [professorname]);

  return { modules, loading, error };
};
