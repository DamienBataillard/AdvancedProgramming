const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); 
const db = require('../config/db');

// Récupérer tous les groupes d'étudiants
router.get('/student-groups', authMiddleware,(req, res) => {
  const sql = 'SELECT * FROM Student_Group';

  db.query(sql, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des groupes d\'étudiants :', error.message);
      return res.status(500).json({ error: 'Erreur serveur lors de la récupération des groupes' });
    }
    res.status(200).json(results);
  });
});

// Créer un nouveau groupe d'étudiants
router.post('/student-groups', authMiddleware,(req, res) => {
  const { name_student_group, year_student_group, semester_student_group } = req.body;

  // Vérifier que les champs nécessaires sont fournis
  if (!name_student_group || !year_student_group || !semester_student_group) {
    return res.status(400).json({
      error: 'Le nom, l\'année et le semestre du groupe sont requis.',
    });
  }

  const sql = `
    INSERT INTO Student_Group (name_student_group, year_student_group, semester_student_group)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [name_student_group, year_student_group, semester_student_group], (error, results) => {
    if (error) {
      console.error('Erreur lors de la création du groupe d\'étudiants :', error.message);
      return res.status(500).json({ error: 'Erreur serveur lors de la création du groupe' });
    }
    res.status(201).json({
      message: 'Groupe d\'étudiants créé avec succès.',
      groupId: results.insertId,
    });
  });
});

// Ajouter un étudiant à un groupe
router.post('/student-groups/:groupId/students', authMiddleware,(req, res) => {
  const { groupId } = req.params;
  const { studentId } = req.body;

  if (!groupId || !studentId) {
    return res.status(400).json({ error: 'L\'ID du groupe et l\'ID de l\'étudiant sont requis.' });
  }

  const sql = `
    INSERT INTO Student_Group_Association (id_student, id_student_group)
    VALUES (?, ?)
  `;
  db.query(sql, [studentId, groupId], (error, results) => {
    if (error) {
      console.error('Erreur lors de l\'ajout de l\'étudiant au groupe :', error.message);
      return res.status(500).json({ error: 'Erreur serveur lors de l\'ajout de l\'étudiant' });
    }
    res.status(201).json({
      message: 'Étudiant ajouté au groupe avec succès.',
      associationId: results.insertId,
    });
  });
});

// Récupérer les étudiants d'un groupe spécifique
router.get('/student-groups/:groupId/students', authMiddleware,(req, res) => {
  const { groupId } = req.params;

  if (!groupId) {
    return res.status(400).json({ error: 'L\'ID du groupe est requis.' });
  }

  const sql = `
    SELECT p.id_profile, p.first_name_profile, p.last_name_profile
    FROM Profile p
    INNER JOIN Student_Group_Association sga ON p.id_profile = sga.id_student
    WHERE sga.id_student_group = ?
  `;

  db.query(sql, [groupId], (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des étudiants du groupe :', error.message);
      return res.status(500).json({ error: 'Erreur serveur lors de la récupération des étudiants' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Aucun étudiant trouvé pour ce groupe.' });
    }

    res.status(200).json(results);
  });
});

module.exports = router;
