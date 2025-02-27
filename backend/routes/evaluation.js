const express = require('express');
const db = require('../config/db'); // Import de la configuration de la base de données
const authMiddleware = require('../middleware/auth'); // Importer le middleware
const router = express.Router();

// Route pour récupérer les évaluations accessibles à un étudiant
router.get('/evaluations/:studentId', authMiddleware, (req, res) => {
  const { studentId } = req.params;

  console.log(studentId)

  const query = `
    SELECT evaluation.*
    FROM evaluation
    JOIN student_group ON evaluation.id_student_group = student_group.id_student_group
    JOIN student_group_association ON student_group.id_student_group = student_group_association.id_student_group
    WHERE student_group_association.id_student = ?
  `;

  db.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des évaluations :', err);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
    
    res.status(200).json(results);
  });
});

// Route pour récupérer toutes les évaluations pour les administrateurs
router.get('/evaluations', authMiddleware, (req, res) => {
  const { role } = req.user;
  console.log("Rôle de l'utilisateur :", role);

  if (role !== 'Admin') {
    return res.status(403).json({ message: 'Accès interdit : réservé aux administrateurs.' });
  }

  const query = `SELECT * FROM evaluation`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des évaluations :', err);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }

    res.status(200).json(results);
  });
});


// Route pour récupérer une évaluation et ses questions
router.get('/evaluation/:id', authMiddleware, (req, res) => {
  const evaluationId = req.params.id;

  // Requête SQL pour récupérer l'évaluation
  const evaluationQuery = `SELECT * FROM evaluation WHERE id_evaluation = ?`;
  const questionsQuery = `SELECT * FROM question WHERE id_evaluation = ?`;

  db.query(evaluationQuery, [evaluationId], (err, evaluationResult) => {
    if (err) {
      console.error('Erreur lors de la récupération de l\'évaluation :', err);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }

    if (evaluationResult.length === 0) {
      return res.status(404).json({ message: 'Évaluation non trouvée.' });
    }

    db.query(questionsQuery, [evaluationId], (err, questionsResult) => {
      if (err) {
        console.error('Erreur lors de la récupération des questions :', err);
        return res.status(500).json({ message: 'Erreur interne du serveur.' });
      }

      res.status(200).json({
        evaluation: evaluationResult[0],
        questions: questionsResult,
      });
    });
  });
});

module.exports = router;
