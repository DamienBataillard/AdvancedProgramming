const express = require('express');
const prisma = require('../prismaClient'); // Importer Prisma
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Route pour récupérer les informations du profil
router.get('/profil', authMiddleware, async (req, res) => {

  console.log('Utilisateur autorisé:', req.user); // Log des informations utilisateur pour le débogage

  try {
    const profile = await prisma.profile.findUnique({
      where: { id_profile: req.user.id_profile},
      select: {
        id_profile: true,
        mail_profile: true,
        name_profile: true,
        date_of_birth_profile: true,
        img_profile: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ message: 'Aucun profil trouvé pour cet utilisateur.' });
    }

    res.status(200).json({
      message: 'Informations du profil récupérées avec succès.',
      profile,
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des informations du profil :', err.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
