require('dotenv').config();
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient'); // Si vous utilisez Prisma
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Token manquant.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token invalide.' });
  }

  console.log('Token reçu :', token);

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('Token décodé :', decoded);

    // Vérifiez si l'utilisateur est toujours actif en base de données (optionnel)
    const user = await prisma.profile.findUnique({
      where: { id_profile: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Compte désactivé.' });
    }

    req.user = { id_profile: decoded.userId, ...decoded };// Ajoute les informations du token à la requête
    next(); // Passe au middleware suivant
  } catch (err) {
    console.error('Erreur de validation du token :', err.message);

    // Différencie les types d'erreurs
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expiré.' });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Token invalide.' });
    }

    return res.status(403).json({ message: 'Erreur lors de la validation du token.' });
  }
};
