require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = (req, res, next) => {
  console.log('--- Début du middleware auth.js ---');
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header :', authHeader);

  if (req.originalUrl === '/api/login') {
    console.log('Ignoré pour /api/login');
    return next();
}

  if (!authHeader) {
    console.error('Erreur : Aucun en-tête Authorization trouvé.');
    return res.status(401).json({ message: 'Token manquant ou invalide.' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token extrait :', token);

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('Token décodé :', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Erreur lors de la validation du token :', err.message);
    return res.status(403).json({ message: 'Token invalide.' });
  }
};
