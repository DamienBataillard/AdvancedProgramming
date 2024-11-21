const express = require('express');
const db = require('../config/db'); // Connexion à la base de données
const router = express.Router();

// Route pour enregistrer les réponses
router.post('/submit-answers', (req, res) => {
    console.log('Requête reçue pour /submit-answers');
    const { answers, studentId } = req.body;
  
    console.log('Données reçues :', { answers, studentId });
  
    if (!answers || !studentId) {
      return res.status(400).json({ message: 'Données manquantes.' });
    }

  

  const query = `
    INSERT INTO answer (content_answer, is_private, id_question, id_student)
    VALUES ?
  `;

  const values = answers.map((answer) => [
    answer.content_answer,
    answer.is_private || 0,
    answer.id_question,
    studentId,
  ]);

  db.query(query, [values], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'enregistrement des réponses :', err);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }

    res.status(201).json({ message: 'Réponses enregistrées avec succès.' });
  });
});

module.exports = router;
