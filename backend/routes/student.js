const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Récupérer uniquement les étudiants (ayant le rôle "student")
router.get('/students', (req, res) => {
  const sql = `
    SELECT p.id_profile, p.first_name_profile, p.last_name_profile
    FROM Profile p
    JOIN Profile_Role pr ON p.id_profile = pr.id_profile
    JOIN Role r ON pr.id_role = r.id_role
    WHERE r.name_role = 'student'  -- Filtrer uniquement les étudiants
  `;

  db.query(sql, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des étudiants :', error.message);
      return res.status(500).json({ error: 'Erreur serveur lors de la récupération des étudiants' });
    }
    res.status(200).json(results);  // Retourner les étudiants
  });
});

module.exports = router;
