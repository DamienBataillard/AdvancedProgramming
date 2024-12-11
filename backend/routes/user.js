const express = require('express');
const prisma = require('../prismaClient'); // Importer Prisma
const router = express.Router();

// Récupérer les utilisateurs avec leur rôle
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.profile.findMany({
      include: {
        profile_role: {
          include: {
            role: true, // Inclure toutes les informations sur les rôles associés
          },
        },
      },
    });

    // Formater les données pour inclure les rôles avec toutes leurs informations
    const formattedUsers = users.map((user) => ({
      id_profile: user.id_profile,
      mail_profile: user.mail_profile,
      name_profile: user.name_profile,
      roles: user.profile_role.map((pr) => ({
        id_role: pr.role.id_role,
        name_role: pr.role.name_role,
      })), // Extraire les ID et noms des rôles
    }));

    console.log(formattedUsers)

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
    await prisma.profile_role.deleteMany({
      where: { id_profile: parseInt(id, 10) },
    });

    // Ajouter le nouveau rôle
    await prisma.profile_role.create({
      data: {
        id_profile: parseInt(id, 10),
        id_role: parseInt(roleId, 10),
      },
    });

    res.status(200).json({ message: 'Rôle mis à jour avec succès' });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du rôle :', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
