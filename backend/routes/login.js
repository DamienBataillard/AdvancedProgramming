const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient'); // Importer Prisma
require('dotenv').config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY; // Clé secrète pour JWT

// Route pour connecter un utilisateur
router.post('/login', async (req, res) => {
  const { mail_profile, password_profile } = req.body;

  if (!mail_profile || !password_profile) {
    return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
  }

  try {
    // Récupérer l'utilisateur avec son rôle via `profile_role`
    const user = await prisma.profile.findUnique({
      where: { mail_profile },
      include: {
        profile_role: {
          include: {
            role: true, // Inclure les informations sur les rôles
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password_profile, user.password_profile);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Génération du JWT
    const token = jwt.sign(
      {
        userId: user.id_profile,
        email: user.mail_profile,
        role: user.profile_role.length > 0 ? user.profile_role[0].role.name_role : 'Aucun rôle',
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Réponse avec le token et les informations utilisateur
    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: user.id_profile,
        mail_profile: user.mail_profile,
        name_profile: user.name_profile,
        role: user.profile_role.length > 0 ? user.profile_role[0].role.name_role : 'Aucun rôle',
      },
    });
  } catch (err) {
    console.error('Erreur lors de la connexion :', err.message);
    res.status(500).json({ message: 'Erreur interne.' });
  }
});

module.exports = router;
