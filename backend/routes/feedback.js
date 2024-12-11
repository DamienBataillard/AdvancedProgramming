const express = require('express');
const prisma = require('../prismaClient'); // Importer Prisma
const router = express.Router();

// Route pour récupérer les feedbacks d'un étudiant
router.get('/feedbacks/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    // Récupérer les feedbacks liés à l'étudiant
    const feedbacks = await prisma.feedback.findMany({
      where: { id_student: parseInt(studentId, 10) },
      select: {
        id_feedback: true,
        title_feedback: true,
        date_created: true,
        content_feedback: true,
      },
    });

    if (feedbacks.length === 0) {
      return res.status(404).json({ message: 'Aucun feedback trouvé pour cet étudiant.' });
    }

    res.status(200).json(feedbacks);
  } catch (err) {
    console.error('Erreur lors de la récupération des feedbacks :', err.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
