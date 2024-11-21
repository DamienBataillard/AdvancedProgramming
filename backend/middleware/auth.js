require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Récupère l'en-tête Authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  const token = authHeader.split(' ')[1]; // Récupère uniquement le token après "Bearer"
  if (!token) {
    return res.status(401).json({ message: 'Token invalide' });
  }

  console.log('Token reçu :', token);

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Vérifie et décode le token
    req.user = decoded; // Ajoute les informations du token à la requête
    next(); // Passe au middleware suivant
  } catch (err) {
    console.error('Erreur de validation du token :', err.message);
    return res.status(403).json({ message: 'Token invalide.' });
  }
};

