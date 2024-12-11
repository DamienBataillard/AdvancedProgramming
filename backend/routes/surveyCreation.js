const express = require('express');
const prisma = require('../prismaClient'); // Import de Prisma
const authMiddleware = require('../middleware/auth'); // Middleware pour vérifier le token
const router = express.Router();

// Route pour SurveyCreation
router.get('/survey-creation', authMiddleware, async (req, res) => {
  try {
    // Récupérer les informations utilisateur (si besoin)
    const user = await prisma.profile.findUnique({
      where: { id: req.user.userId },
      select: {
        id_profile: true,
        name_profile: true,
        mail_profile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.status(200).json({
      message: 'Accès autorisé pour SurveyCreation',
      user, // Informations utilisateur
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des données utilisateur :', err.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
