const API_BASE_URL = "http://localhost:5000/api";

export const fetchEvaluations = async (studentId) => {
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
