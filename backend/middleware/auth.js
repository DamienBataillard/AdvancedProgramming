require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];


  if (req.originalUrl === '/api/login') {
    console.log('Ignoré pour /api/login');
    return next();
}

  if (!authHeader) {
    console.error('Erreur : Aucun en-tête Authorization trouvé.');
    return res.status(401).json({ message: 'Token manquant ou invalide.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Erreur lors de la validation du token :', err.message);
    return res.status(403).json({ message: 'Token invalide.' });
  }
};
