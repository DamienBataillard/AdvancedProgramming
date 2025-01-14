const express = require('express');
const db = require('../config/db'); // Connexion à la base de données
const authMiddleware = require('../middleware/auth'); // Middleware d'authentification
const router = express.Router();

// Route pour récupérer les modules accessibles à un étudiant
router.get('/modules/:studentId', authMiddleware, (req, res) => {
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

// Route pour récupérer les commentaires d'un module
router.get('/module/:moduleId/comments', authMiddleware, (req, res) => {
  const { moduleId } = req.params;

  const query = `
    SELECT comment.*, profile.first_name_profile
    FROM comment
    JOIN profile ON comment.id_author = profile.id_profile
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
router.post('/module/:moduleId/comments', authMiddleware, (req, res) => {
  const { moduleId } = req.params;
  const { content_comment } = req.body;
  const userId = req.user.userId; // ID de l'utilisateur authentifié
  const userRole = req.user.role; // Rôle de l'utilisateur

  if (!content_comment) {
    return res.status(400).json({ message: 'Le contenu du commentaire est requis.' });
  }

  // Validation supplémentaire si nécessaire
  if (!['Student', 'Teacher'].includes(userRole)) {
    return res.status(403).json({ message: 'Seuls les étudiants et les professeurs peuvent laisser des commentaires.' });
  }

  const query = `
    INSERT INTO comment (content_comment, id_module, id_author, date_comment)
    VALUES (?, ?, ?, NOW())
  `;

  db.query(query, [content_comment, moduleId, userId], (err, result) => {
    if (err) {
      console.error('Erreur lors de l’ajout du commentaire :', err);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }

    res.status(201).json({ message: 'Commentaire ajouté avec succès.' });
  });
});

module.exports = router;
