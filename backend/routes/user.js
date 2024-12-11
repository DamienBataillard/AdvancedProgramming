const express = require('express');
const prisma = require('../prismaClient'); // Importer Prisma
const router = express.Router();

// Récupérer les utilisateurs avec leur rôle
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.profile.findMany({
      include: {
        roles: {
          include: {
            role: true, // Inclure les informations sur les rôles
          },
        },
      },
    });

    // Formatage des résultats pour correspondre au schéma attendu
    const formattedUsers = users.map((user) => ({
      id_profile: user.id_profile,
      mail_profile: user.mail_profile,
      name_profile: user.name_profile,
      id_role: user.roles[0]?.role.id || null, // Si l'utilisateur a un rôle, prendre son ID
      name_role: user.roles[0]?.role.name_role || 'Aucun rôle', // Si l'utilisateur a un rôle, prendre son nom
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer les rôles disponibles
router.get('/roles', async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    res.status(200).json(roles);
  } catch (error) {
    console.error('Erreur lors de la récupération des rôles :', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour le rôle d'un utilisateur
router.put('/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { roleId } = req.body;

  try {
    // Supprimer les anciens rôles associés à l'utilisateur
    await prisma.profile_Role.deleteMany({
      where: { id_profile: parseInt(id) },
    });

    // Ajouter le nouveau rôle
    await prisma.profile_Role.create({
      data: {
        id_profile: parseInt(id),
        id_role: parseInt(roleId),
      },
    });

    res.status(200).json({ message: 'Rôle mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rôle :', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
