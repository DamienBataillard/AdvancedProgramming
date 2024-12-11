const API_BASE_URL = "http://localhost:5000/api";

export const fetchEvaluations = async (studentId) => {
  if (!studentId) {
    throw new Error('Student ID is required');
  }
  const response = await fetch(`${API_BASE_URL}/evaluations/${studentId}`);
  if (!response.ok) throw new Error("Erreur lors de la récupération des évaluations.");
  return response.json();
};

export const fetchModules = async (studentId) => {
  const response = await fetch(`${API_BASE_URL}/modules/${studentId}`);
  if (!response.ok) throw new Error("Erreur lors de la récupération des modules.");
  return response.json();
};

export const verifyToken = async (token) => {
  const response = await fetch(`${API_BASE_URL}/dashboard`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Accès interdit.");
  return response.json();
};

export const APIService = {
    register: async (formData) => {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      return response.json();
    },
  };

  export const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la connexion.');
    }
  
    return await response.json();
  };

  export const fetchComments = async (moduleId) => {
    const response = await fetch(`${API_BASE_URL}/module/${moduleId}/comments`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commentaires.');
    }
    return await response.json();
  };
  
  export const postComment = async ({ moduleId, content_comment, id_student }) => {
    const response = await fetch(`${API_BASE_URL}/module/${moduleId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content_comment, id_student }),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l’ajout du commentaire.');
    }
  };

  export const fetchEvaluation = async (id) => {
    const response = await fetch(`${API_BASE_URL}/evaluation/${id}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données.');
    }
    return await response.json();
  };
  
  export const submitAnswers = async (answers, studentId) => {
    const response = await fetch(`${API_BASE_URL}/submit-answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, studentId }),
    });
  
    if (!response.ok) {
      throw new Error("Erreur lors de l'enregistrement des réponses.");
    }
    return await response.json();
  };