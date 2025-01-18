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
  db.query('SELECT id_module, code_module FROM Module', (err, results) => {
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
  const { module, teacher, studentGroup, startDate, endDate, questions, title } = req.body;
  console.log("Requête de création de sondage reçue :", req.body);
  if (!module || !teacher || !studentGroup || !startDate || !endDate || questions.length === 0 || !title) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }
  

  // Conversion des dates au format YYYY-MM-DD
  const formattedStartDate = new Date(startDate).toISOString().split("T")[0];
  const formattedEndDate = new Date(endDate).toISOString().split("T")[0];

  // Étape 1 : Insérer l'évaluation
  const evaluationQuery = `
    INSERT INTO evaluation (date_opening, date_closing, title_evaluation, id_student_group)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    evaluationQuery,
    [formattedStartDate, formattedEndDate, title, studentGroup],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de l'insertion de l'évaluation :", err);
        return res.status(500).json({ error: "Erreur lors de la création de l'évaluation." });
      }

      const evaluationId = result.insertId; // ID de l'évaluation nouvellement créée
      console.log("Évaluation créée avec ID :", evaluationId);

      // Étape 2 : Insérer les questions
      const questionsQuery = `
        INSERT INTO question (type_question, title_question, content_question, id_evaluation)
        VALUES ?
      `;

      const questionsData = questions.map((q) => [
        q.type === "text" ? 1 : 2, // 1 pour texte, 2 pour une note
        q.text,
        "",
        evaluationId,
      ]);

      db.query(questionsQuery, [questionsData], (err) => {
        if (err) {
          console.error("Erreur lors de l'insertion des questions :", err);
          return res.status(500).json({ error: "Erreur lors de l'ajout des questions." });
        }

        res.status(201).json({ message: "Sondage et questions créés avec succès !" });
      });
    }
  );
});



module.exports = router;
