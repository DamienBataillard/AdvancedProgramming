const express = require('express');
const db = require('../config/db'); // Import de la configuration DB

const router = express.Router();

// Route pour enregistrer un utilisateur
router.post('/register', (req, res) => {
  const { mail_profile, name_profile, date_of_birth_profile, password_profile } = req.body;

  // Requête SQL pour insérer un utilisateur
  const query = `
    INSERT INTO profile (mail_profile, name_profile, date_of_birth_profile, password_profile)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [mail_profile, name_profile, date_of_birth_profile, password_profile], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion de l\'utilisateur:', err);
      res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
      return;
    }

    res.status(200).json({ message: 'Utilisateur enregistré avec succès', userId: result.insertId });
  });
});

module.exports = router;
