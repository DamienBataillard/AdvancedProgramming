const express = require('express');
const prisma = require('../prismaClient'); // Importer Prisma
const router = express.Router();

// Route pour récupérer les modules accessibles à un étudiant
router.get('/modules/:studentId', async (req, res) => {
  const { studentId } = req.params;

  console.log('ID étudiant reçu:', studentId); // Debug

  if (!studentId) {
    return res.status(400).json({ message: 'ID étudiant manquant dans les paramètres.' });
  }
  
  try {
    const modules = await prisma.module.findMany({
      where: {
        group_module: {
          some: {
            student_group: {
              student_group_association: {
                some: {
                  id_student: parseInt(studentId, 10), // Assurez-vous que studentId est un entier valide
                },
              },
            },
          },
        },
      },
      distinct: ['id_module'], // Éviter les doublons
    });
    

    res.status(200).json(modules);
  } catch (err) {
    console.error('Erreur lors de la récupération des modules :', err.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Route pour récupérer les commentaires d'un module
router.get('/module/:moduleId/comments', async (req, res) => {
  const { moduleId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        id_module: parseInt(moduleId, 10),
      },
      include: {
        profile: {
          select: {
            name_profile: true, // Inclure uniquement le nom du profil
          },
        },
      },
    });

    res.status(200).json(comments);
  } catch (err) {
    console.error('Erreur lors de la récupération des commentaires :', err.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Route pour poster un commentaire
router.post('/module/:moduleId/comments', async (req, res) => {
  const { moduleId } = req.params;
  const { content_comment, id_student } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: {
        content_comment,
        id_module: parseInt(moduleId, 10), // Convertit moduleId en entier
        id_student: parseInt(id_student, 10), // Convertit id_student en entier
        date_comment: new Date(), // Définit la date actuelle
      },
    });

    res.status(201).json({ message: 'Commentaire ajouté avec succès.', newComment });
  } catch (err) {
    console.error('Erreur lors de l’ajout du commentaire :', err.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
