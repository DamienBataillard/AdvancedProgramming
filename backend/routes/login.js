const express = require('express');
const bcrypt = require('bcrypt'); // Pour comparer les mots de passe hachés
const db = require('../config/db'); // Connexion à la base de données

const router = express.Router();

// Route pour connecter un utilisateur
router.post('/login', (req, res, next) => {
  const { mail_profile, password_profile } = req.body;

  // Vérification des champs obligatoires
  if (!mail_profile || !password_profile) {
    return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
  }

  // Requête pour rechercher l'utilisateur par email
  const query = `SELECT * FROM profile WHERE mail_profile = ?`;

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
      // Comparaison du mot de passe saisi avec le mot de passe haché
      const isPasswordValid = await bcrypt.compare(password_profile, user.password_profile);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Mot de passe incorrect.' });
      }

      // Réponse en cas de succès
      res.status(200).json({
        message: 'Connexion réussie.',
        user: {
          id_profile: user.id_profile,
          mail_profile: user.mail_profile,
          name_profile: user.name_profile,
        },
      });
    } catch (err) {
      console.error('Erreur lors de la vérification du mot de passe :', err);
      return res.status(500).json({ message: 'Erreur lors de la connexion.' });
    }
  });
});

module.exports = router;
