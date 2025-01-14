const API_BASE_URL = "http://localhost:5000/api";

export const fetchEvaluations = async (studentId) => {
  const response = await fetch(`http://localhost:5000/api/evaluations/${studentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Récupère le token depuis le localStorage
    },
  });
  if (!response.ok) throw new Error("Erreur lors de la récupération des évaluations.");
  return response.json();
};

export const fetchModules = async (studentId) => {
  const response = await fetch(`${API_BASE_URL}/modules/${studentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Récupère le token depuis le localStorage
    },
  });
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
    try {
      console.log('Envoi des données de connexion :', credentials);
  
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
  
      console.log('Réponse brute :', response);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur retournée par le backend :', errorData);
        throw new Error(errorData.message || 'Erreur lors de la connexion.');
      }
  
      const data = await response.json();
      console.log('Données reçues du serveur :', data);
      return data;
    } catch (err) {
      console.error('Erreur dans loginUser :', err.message);
      throw err; // Propager l'erreur pour qu'elle soit capturée dans le composant parent
    }
  };
  
  export const fetchComments = async (moduleId) => {
    const response = await fetch(`${API_BASE_URL}/module/${moduleId}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Récupère le token depuis le localStorage
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commentaires.');
    }
    return await response.json();
  };
  
  export const postComment = async ({ moduleId, content_comment }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Vous devez être connecté pour publier un commentaire.');
    }
  
    const response = await fetch(`${API_BASE_URL}/module/${moduleId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content_comment }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l’ajout du commentaire.');
    }
  
    console.log('Commentaire publié avec succès');
  };
  

  export const fetchEvaluation = async (id) => {
    const response = await fetch(`${API_BASE_URL}/evaluation/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Récupère le token depuis le localStorage
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données.');
    }
    return await response.json();
  };
  
  export const submitAnswers = async (answers, studentId) => {
    const response = await fetch(`${API_BASE_URL}/submit-answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
       },
      body: JSON.stringify({ answers, studentId }),
    });
  
    if (!response.ok) {
      throw new Error("Erreur lors de l'enregistrement des réponses.");
    }
    return await response.json();
  };