const express = require('express');
const bcrypt = require('bcrypt'); // Import de bcrypt
const prisma = require('../prismaClient'); // Importer Prisma
const router = express.Router();

// Route pour enregistrer un utilisateur
router.post('/register', async (req, res) => {
  const { mail_profile, name_profile, date_of_birth_profile, password_profile } = req.body;

  // Vérification des champs obligatoires
  if (!mail_profile || !name_profile || !date_of_birth_profile || !password_profile) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    // Hachage du mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password_profile, saltRounds);

    // Création d'un utilisateur avec Prisma
    const newUser = await prisma.profile.create({
      data: {
        mail_profile,
        name_profile,
        date_of_birth_profile: new Date(date_of_birth_profile), // Conversion en date
        password_profile: hashedPassword,
      },
    });

    res.status(201).json({
      message: 'Utilisateur enregistré avec succès',
      userId: newUser.id_profile,
    });
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement de l\'utilisateur :', err.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
