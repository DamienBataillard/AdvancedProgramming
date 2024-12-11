const express = require('express');
const prisma = require('../prismaClient'); // Importer Prisma
const router = express.Router();

// Route pour récupérer les évaluations accessibles à un étudiant
router.get('/evaluations/:studentId', async (req, res) => {
  const { studentId } = req.params;

  console.log(studentId)

  if (!studentId) {
    return res.status(400).json({ message: 'Student ID is missing' });
  }

  try {
    const evaluations = await prisma.evaluation.findMany({
      where: {
        student_group: {
          student_group_association: {
            some: {
              id_student: parseInt(studentId, 10),
            },
          },
        },
      },
    });
    res.status(200).json(evaluations);
  } catch (err) {
    console.error('Erreur lors de la récupération des évaluations :', err.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});


// Route pour récupérer une évaluation et ses questions
router.get('/evaluation/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Récupérer l'évaluation avec ses questions associées
    const evaluation = await prisma.evaluation.findUnique({
      where: { id_evaluation: parseInt(id, 10) }, // Assurez-vous que le champ est correct
      include: {
        question: true, // Inclure les questions associées
      },
    });

    if (!evaluation) {
      return res.status(404).json({ message: 'Évaluation non trouvée.' });
    }

    res.status(200).json(evaluation);
  } catch (err) {
    console.error("Erreur lors de la récupération de l'évaluation :", err.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});


module.exports = router;
