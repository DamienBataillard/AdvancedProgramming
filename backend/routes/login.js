const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import de JWT
const db = require('../config/db');
require('dotenv').config();

const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY; // Utilisez une clé secrète sécurisée (stockez-la dans un fichier .env)

// Route pour connecter un utilisateur
router.post('/login', (req, res, next) => {
  const { mail_profile, password_profile } = req.body;

  if (!mail_profile || !password_profile) {
    return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
  }

  const query = `
    SELECT p.*, r.name_role
    FROM profile p
    LEFT JOIN profile_role pr ON p.id_profile = pr.id_profile
    LEFT JOIN role r ON pr.id_role = r.id_role
    WHERE p.mail_profile = ?;
  `;

  db.query(query, [mail_profile], async (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche de l\'utilisateur :', err);
      return res.status(500).json({ message: 'Erreur interne.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const user = results[0]; // Récupération de l'utilisateur trouvé

    try {
      const isPasswordValid = await bcrypt.compare(password_profile, user.password_profile);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Mot de passe incorrect.' });
      }

      // Génération du JWT
      const token = jwt.sign(
        {
          userId: user.id_profile,
          email: user.mail_profile,
          role: user.name_role,
        },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      // Inclure les informations utilisateur dans la réponse
      res.status(200).json({
        message: 'Connexion réussie.',
        token,
        user: {
          id_profile: user.id_profile,
          mail_profile: user.mail_profile,
          name_profile: user.name_profile, // Inclure cette propriété
          role: user.name_role,
        },
      });
    } catch (err) {
      console.error('Erreur lors de la vérification du mot de passe :', err);
      return res.status(500).json({ message: 'Erreur interne.' });
    }
  });
});


module.exports = router;
