const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Récupérer les utilisateurs avec leur rôle
router.get('/users', (req, res) => {
  const sql = `
    SELECT 
      p.id_profile, 
      p.mail_profile, 
      p.name_profile, 
      r.id_role, 
      r.name_role 
    FROM Profile p
    LEFT JOIN Profile_Role pr ON p.id_profile = pr.id_profile
    LEFT JOIN Role r ON pr.id_role = r.id_role;
  `;

  // Exécution de la requête avec callback
  db.query(sql, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(results);
  });
});

// Récupérer les rôles disponibles
router.get('/roles', (req, res) => {
  const sql = 'SELECT id_role, name_role FROM Role';

  // Exécution de la requête avec callback
  db.query(sql, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des rôles :', error.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(results);
  });
});

// Mettre à jour le rôle d'un utilisateur
router.put('/users/:id/role', (req, res) => {
  const { id } = req.params;
  const { roleId } = req.body;

  const sqlDelete = 'DELETE FROM Profile_Role WHERE id_profile = ?';
  const sqlInsert = 'INSERT INTO Profile_Role (id_profile, id_role) VALUES (?, ?)';

  db.query(sqlDelete, [id], (deleteError) => {
    if (deleteError) {
      console.error('Erreur lors de la suppression de l’ancien rôle :', deleteError.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    db.query(sqlInsert, [id, roleId], (insertError) => {
      if (insertError) {
        console.error('Erreur lors de l’ajout du nouveau rôle :', insertError.message);
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      res.json({ message: 'Rôle mis à jour avec succès' });
    });
  });
});

module.exports = router;
