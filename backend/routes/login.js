const express = require('express');
const db = require('../config/db'); // Import de la configuration DB

const router = express.Router();

// Route pour connecter un utilisateur
router.post('/login', (req, res) => {
  const { mail_profile, password_profile } = req.body;

  // Requête SQL pour trouver un utilisateur par son email
  const query = `
    SELECT * FROM profile WHERE mail_profile = ?
  `;

  db.query(query, [mail_profile], (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche de l\'utilisateur:', err);
      res.status(500).json({ message: 'Erreur lors de la connexion' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }

    const user = results[0];

    // Vérification du mot de passe (à améliorer avec bcrypt plus tard)
    if (user.password_profile !== password_profile) {
      res.status(401).json({ message: 'Mot de passe incorrect' });
      return;
    }

    res.status(200).json({ message: 'Connexion réussie', user });
  });
});

module.exports = router;
