const express = require('express');
const bcrypt = require('bcrypt'); // Import de bcrypt
const db = require('../config/db'); // Import de la configuration DB

const router = express.Router();

// Route pour enregistrer un utilisateur
router.post('/register', async (req, res, next) => {
  const { mail_profile, first_name_profile,last_name_profile, date_of_birth_profile, password_profile } = req.body;

  // Vérification des champs obligatoires
  if (!mail_profile || !first_name_profile || !last_name_profile || !date_of_birth_profile || !password_profile) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    // Hachage du mot de passe
    const saltRounds = 10; // Nombre de tours de salage
    const hashedPassword = await bcrypt.hash(password_profile, saltRounds);

    // Requête SQL pour insérer l'utilisateur
    const query = `
      INSERT INTO profile (mail_profile, first_name_profile, last_name_profile, date_of_birth_profile, password_profile)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [mail_profile, first_name_profile,last_name_profile, date_of_birth_profile, hashedPassword], (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'insertion de l\'utilisateur:', err);
        return res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur.' });
      }

      const userId = result.insertId; // ID de l'utilisateur nouvellement créé

      // Rôle par défaut : "Élève" (assurez-vous que ce rôle existe dans votre table `role`)
      const defaultRoleQuery = `
        INSERT INTO profile_role (id_profile, id_role)
        VALUES (?, (SELECT id_role FROM role WHERE name_role = 'Student'))
      `;

      db.query(defaultRoleQuery, [userId], (roleErr) => {
        if (roleErr) {
          console.error('Erreur lors de l\'attribution du rôle par défaut:', roleErr);
          return res.status(500).json({ message: 'Utilisateur créé, mais une erreur est survenue lors de l\'attribution du rôle.' });
        }

      res.status(201).json({ message: 'Utilisateur enregistré avec succès', userId: result.insertId });
      });
    });
  } catch (err) {
    console.error('Erreur lors du hachage du mot de passe :', err);
    next(err); // Passe l'erreur au gestionnaire global
  }
});

module.exports = router;
