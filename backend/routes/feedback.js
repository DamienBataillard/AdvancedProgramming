const express = require('express');
const db = require('../config/db'); // Importez la configuration de la base de données
const authMiddleware = require('../middleware/auth'); // Importer le middleware d'authentification
const router = express.Router();

// Route pour récupérer les feedbacks d'un étudiant
router.get('/feedbacks/:studentId', authMiddleware, (req, res) => {
  const { studentId } = req.params;

  const query = `
    SELECT feedback.id_feedback, feedback.title_feedback, feedback.date_created, feedback.content_feedback
    FROM feedback
    WHERE feedback.id_student = ?
  `;

  db.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des feedbacks :', err);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Aucun feedback trouvé pour cet étudiant.' });
    }

    res.status(200).json(results);
  });
});

module.exports = router;
