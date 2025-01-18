const API_BASE_URL = "http://localhost:5000/api";

export const fetchAllEvaluations = async () => {
  console.log("Appel à fetchAllEvaluations");
  const response = await fetch(`http://localhost:5000/api/evaluations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    console.error("Erreur API :", await response.text());
    throw new Error("Erreur lors de la récupération de toutes les évaluations.");
  }
  const data = await response.json();
  console.log("Évaluations reçues :", data);
  return data;
};


export const fetchEvaluations = async (studentId) => {
  console.log("test")
  const response = await fetch(`http://localhost:5000/api/evaluations/${studentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Récupère le token depuis le localStorage
    },
  });
  if (!response.ok) {
    console.error("Erreur API :", await response.text());
    throw new Error("Erreur lors de la récupération de toutes les évaluations.");
  }
  const data = await response.json();
  console.log("Évaluations reçues :", data);
  return data;
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
  
  export const postComment = async ({ moduleId, content_comment, is_anonymous }) => {
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
      body: JSON.stringify({ content_comment , is_anonymous }),
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

  export const fetchNotifications = async () => {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token from localStorage
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur lors de la récupération des notifications:', errorData);
      throw new Error(errorData.message || 'Erreur lors de la récupération des notifications.');
    }
  
    const data = await response.json();
    console.log('Notifications reçues:', data);
    return data;
  };

  export const updateNotificationStatus = async (notificationId, isRead) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token from localStorage
            },
            body: JSON.stringify({ is_read: isRead }), // Send the `is_read` value in the body
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erreur lors de la mise à jour de la notification:', errorData);
            throw new Error(errorData.message || 'Erreur lors de la mise à jour de la notification.');
        }

        console.log('Notification mise à jour avec succès');
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};


  export const fetchModulesNames = async () => {
    const response = await fetch(`${API_BASE_URL}/survey-creation/modulesname`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      console.error("Erreur API :", await response.text());
      throw new Error("Erreur lors de la récupération des modulesname.");
    }
    return await response.json();
  };
  
  export const fetchStudentGroupsByModule = async (moduleId) => {
    const response = await fetch(`${API_BASE_URL}/survey-creation/student-groups-by-module/${moduleId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      },
    });
  
    if (!response.ok) {
      console.error("Erreur API :", await response.text());
      throw new Error("Erreur lors de la récupération des groupes d'étudiants.");
    }
    return await response.json();
  };
  

  export const createSurvey = async (surveyData) => {
    const response = await fetch(`${API_BASE_URL}/survey-creation/surveys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(surveyData),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur API :", errorText);
      throw new Error("Erreur lors de la création du sondage.");
    }
  
    return await response.json();
  };



