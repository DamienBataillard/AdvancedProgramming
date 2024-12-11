const express = require('express');
const prisma = require('../prismaClient'); // Importer Prisma
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Route pour le tableau de bord
router.get('/dashboard', authMiddleware, async (req, res) => {
  console.log('Utilisateur autorisé:', req.user); // Log des informations de l'utilisateur

  try {
    // Récupérer des informations supplémentaires sur l'utilisateur depuis la base de données
    const user = await prisma.profile.findUnique({
      where: { id: req.user.id }, // Récupérer l'utilisateur par son ID
      include: {
        roles: {
          include: {
            role: true, // Inclure les rôles associés
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    res.status(200).json({
      message: 'Bienvenue sur le tableau de bord',
      user,
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des informations utilisateur :', err.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
