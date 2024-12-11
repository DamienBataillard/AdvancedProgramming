const express = require('express');
const db = require('../config/db'); // Connexion à la base de données
const router = express.Router();

// Route pour récupérer les modules accessibles à un étudiant
router.get('/modules/:studentId', (req, res) => {
  const { studentId } = req.params;

  const query = `
    SELECT DISTINCT module.*
    FROM module
    JOIN group_module ON module.id_module = group_module.id_module
    JOIN student_group ON group_module.id_student_group = student_group.id_student_group
    JOIN student_group_association ON student_group.id_student_group = student_group_association.id_student_group
    WHERE student_group_association.id_student = ?
  `;

  db.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des modules :', err);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }

    res.status(200).json(results);
  });
});

router.get('/module/:moduleId/comments', (req, res) => {
    const { moduleId } = req.params;
  
    const query = `
      SELECT comment.*, profile.first_name_profile
      FROM comment
      JOIN profile ON comment.id_student = profile.id_profile
      WHERE comment.id_module = ?
    `;
  
    db.query(query, [moduleId], (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des commentaires :', err);
        return res.status(500).json({ message: 'Erreur interne du serveur.' });
      }
  
      res.status(200).json(results);
    });
  });
  
  // Route pour poster un commentaire
  router.post('/module/:moduleId/comments', (req, res) => {
    const { moduleId } = req.params;
    const { content_comment, id_student } = req.body;
  
    const query = `
      INSERT INTO comment (content_comment, id_module, id_student, date_comment)
      VALUES (?, ?, ?, NOW())
    `;
  
    db.query(query, [content_comment, moduleId, id_student], (err, results) => {
      if (err) {
        console.error('Erreur lors de l’ajout du commentaire :', err);
        return res.status(500).json({ message: 'Erreur interne du serveur.' });
      }
  
      res.status(201).json({ message: 'Commentaire ajouté avec succès.' });
    });
  });
  

module.exports = router;
