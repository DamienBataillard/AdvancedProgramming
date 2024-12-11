const express = require('express');
const prisma = require('../prismaClient'); // Importer Prisma
const router = express.Router();

// Route pour enregistrer les réponses
router.post('/submit-answers', async (req, res) => {
  console.log('Requête reçue pour /submit-answers');
  const { answers, studentId } = req.body;

  console.log('Données reçues :', { answers, studentId });

  if (!answers || !studentId) {
    return res.status(400).json({ message: 'Données manquantes.' });
  }

  try {
    // Insérer toutes les réponses dans la table `answer`
    const createdAnswers = await prisma.answer.createMany({
      data: answers.map((answer) => ({
        content_answer: answer.content_answer,
        is_private: answer.is_private || 0,
        id_question: answer.id_question,
        id_student: studentId,
      })),
    });

    console.log('Réponses enregistrées avec succès :', createdAnswers);

    res.status(201).json({ message: 'Réponses enregistrées avec succès.' });
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement des réponses :', err.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
