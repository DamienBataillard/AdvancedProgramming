const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Récupérer les évaluations des cours d'un professeur (par nom)
router.get('/professor/:professorname/evaluations', authMiddleware, (req, res) => {
  const { professorname } = req.params;

  console.log('Route hit for /professor/:professorname/evaluations');
  console.log('professorName:', req.params.professorname);

  const query = `
    SELECT e.id_evaluation, e.title_evaluation, e.date_opening, e.date_closing, sg.name_student_group
    FROM evaluation e
    JOIN student_group sg ON e.id_student_group = sg.id_student_group
    JOIN group_module gm ON sg.id_student_group = gm.id_student_group
    JOIN module m ON gm.id_module = m.id_module
    WHERE m.professor_module = ?;
  `;

  db.query(query, [professorname], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des évaluations :', err);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }

    console.log(results)

    res.status(200).json(results);
  });
});

// Récupérer les feedbacks pour les cours d'un professeur (par nom)
router.get('/professor/:professorname/modules', authMiddleware, (req, res) => {
    const { professorname } = req.params;
  
    const query = `
      SELECT DISTINCT m.id_module, m.name_module
      FROM module m
      JOIN group_module gm ON m.id_module = gm.id_module
      JOIN student_group sg ON gm.id_student_group = sg.id_student_group
      WHERE m.professor_module = ?;
    `;
  
    db.query(query, [professorname], (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des modules :', err);
        return res.status(500).json({ message: 'Erreur interne du serveur.' });
      }
  
      res.status(200).json(results);
    });
  });
  

module.exports = router;
