const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth'); // Middleware pour vérifier le token

// Route existante pour SurveyCreation
router.get('/survey-creation', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'Accès autorisé pour SurveyCreation',
    user: req.user, // Données de l'utilisateur décodées depuis le token
  });
});

// Nouvelle route pour récupérer les modules
router.get('/modules', authMiddleware, (req, res) => {
  db.query('SELECT id_module, name_module FROM Module', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des modules:', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des modules.' });
    }
    res.json(results);
  });
});

// Nouvelle route pour récupérer les enseignants
router.get('/teachers', authMiddleware, (req, res) => {
  db.query(`
    SELECT id_profile, name_profile 
    FROM Profile 
    WHERE id_profile IN (SELECT id_profile FROM Profile_Role WHERE id_role = 2)
  `, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des enseignants:', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des enseignants.' });
    }
    res.json(results);
  });
});

// Nouvelle route pour récupérer les groupes d'étudiants
router.get('/student-groups', authMiddleware, (req, res) => {
  db.query('SELECT id_student_group, name_student_group FROM Student_Group', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des groupes d\'étudiants:', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des groupes d\'étudiants.' });
    }
    res.json(results);
  });
});

module.exports = router;
