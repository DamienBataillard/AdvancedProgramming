const express = require('express');
const db = require('../config/db'); // Import de la configuration de la base de données
const router = express.Router();

// Route pour récupérer une évaluation et ses questions
router.get('/evaluation/:id', (req, res) => {
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
