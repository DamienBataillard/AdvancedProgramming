const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Récupérer les réponses aux questions d'un survey pour un professeur
router.get('/professor/:professorname/survey/:surveyId/answers', (req, res) => {
    const { professorname, surveyId } = req.params;
    console.log('Professor Name:', professorname);
    console.log('Survey ID:', surveyId);

  const query = `
    SELECT q.id_question, q.content_question, a.content_answer, p.first_name_profile, p.last_name_profile
    FROM answer a
    JOIN question q ON a.id_question = q.id_question
    JOIN evaluation e ON q.id_evaluation = e.id_evaluation
    JOIN student_group sg ON e.id_student_group = sg.id_student_group
    JOIN group_module gm ON sg.id_student_group = gm.id_student_group
    JOIN module m ON gm.id_module = m.id_module
    JOIN profile p ON a.id_student = p.id_profile
    WHERE m.professor_module = ? AND e.id_evaluation = ?;
  `;

  db.query(query, [professorname, surveyId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des réponses :', err);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }

    res.status(200).json(results);
  });
});

module.exports = router;
