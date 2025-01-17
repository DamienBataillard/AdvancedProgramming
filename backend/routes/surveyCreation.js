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
router.get('/modulesname', authMiddleware, (req, res) => {
  console.log('Route /modules atteinte');
  db.query('SELECT id_module, name_module FROM Module', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des modules:', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des modules.' });
    }
    console.log('Modules récupérés :', results);
    res.json(results);
  });
});

// Nouvelle route pour récupérer les enseignants
router.get('/teachers', authMiddleware, (req, res) => {
  console.log('Route /teachers atteinte');
  db.query(`
    SELECT id_profile, last_name_profile 
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


router.post('/surveys', authMiddleware, (req, res) => {
  const { module, teacher, studentGroup, startDate, endDate, questions } = req.body;

  if (!module || !teacher || !studentGroup || !startDate || !endDate || questions.length === 0) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  // Insertion du sondage dans la table Survey
  const surveyQuery = `
    INSERT INTO Survey (id_module, id_teacher, id_student_group, start_date, end_date)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(surveyQuery, [module, teacher, studentGroup, startDate, endDate], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion du sondage :", err);
      return res.status(500).json({ error: "Erreur lors de la création du sondage." });
    }

    const surveyId = result.insertId;

    // Insertion des questions dans la table Survey_Questions
    const questionsQuery = `
      INSERT INTO Survey_Questions (id_survey, question_text, question_type)
      VALUES ?
    `;

    const questionsData = questions.map((q) => [surveyId, q.text, q.type]);

    db.query(questionsQuery, [questionsData], (err) => {
      if (err) {
        console.error("Erreur lors de l'insertion des questions :", err);
        return res.status(500).json({ error: "Erreur lors de l'ajout des questions." });
      }

      res.status(201).json({ message: "Sondage créé avec succès !" });
    });
  });
});

module.exports = router;
