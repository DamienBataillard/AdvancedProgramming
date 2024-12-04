const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Connexion à la base de données

// Récupérer les utilisateurs avec leur rôle
router.get('/users', async (req, res) => {
  const { name, email, role } = req.query;  // Paramètres de filtrage depuis la query string

  let sql = `
    SELECT 
      p.id_profile, 
      p.mail_profile, 
      p.name_profile, 
      r.id_role, 
      r.name_role 
    FROM Profile p
    LEFT JOIN Profile_Role pr ON p.id_profile = pr.id_profile
    LEFT JOIN Role r ON pr.id_role = r.id_role
    WHERE 1=1`;  // Condition de base pour ajouter dynamiquement les autres conditions

  const params = [];  // Tableau pour stocker les paramètres à passer dans la requête SQL

  if (name) {
    sql += ' AND p.name_profile LIKE ?'; // Ajout de la condition pour filtrer par nom
    params.push(`%${name}%`);
  }

  if (email) {
    sql += ' AND p.mail_profile LIKE ?'; // Ajout de la condition pour filtrer par email
    params.push(`%${email}%`);
  }

  if (role) {
    sql += ' AND r.name_role = ?'; // Ajout de la condition pour filtrer par rôle
    params.push(role);
  }

  try {
    const [rows] = await db.execute(sql, params);  // Exécution de la requête SQL avec les paramètres
    res.json(rows);  // Retourner les résultats sous forme de JSON
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error.message);
    res.status(500).json({ error: 'Erreur serveur' });  // Réponse en cas d'erreur
  }
});

// Récupérer les rôles disponibles
router.get('/roles', async (req, res) => {
  const sql = 'SELECT id_role, name_role FROM Role';  // Requête pour obtenir les rôles
  try {
    const [rows] = await db.execute(sql);  // Exécution de la requête
    res.json(rows);  // Retourner les résultats sous forme de JSON
  } catch (error) {
    console.error('Erreur lors de la récupération des rôles :', error.message);
    res.status(500).json({ error: 'Erreur serveur' });  // Réponse en cas d'erreur
  }
});

// Mettre à jour le rôle d'un utilisateur
router.put('/users/:id/role', async (req, res) => {
  const { id } = req.params;  // ID de l'utilisateur à mettre à jour
  const { roleId } = req.body;  // ID du rôle à assigner

  const sqlDelete = 'DELETE FROM Profile_Role WHERE id_profile = ?';  // Requête pour supprimer l'ancien rôle
  const sqlInsert = 'INSERT INTO Profile_Role (id_profile, id_role) VALUES (?, ?)';  // Requête pour ajouter le nouveau rôle

  try {
    await db.execute(sqlDelete, [id]);  // Supprimer les anciens rôles associés
    await db.execute(sqlInsert, [id, roleId]);  // Ajouter le nouveau rôle
    res.json({ message: 'Rôle mis à jour avec succès' });  // Retourner un message de succès
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rôle :', error.message);
    res.status(500).json({ error: 'Erreur serveur' });  // Réponse en cas d'erreur
  }
});

module.exports = router;  // Exporter le module pour l'utiliser dans votre application principale
