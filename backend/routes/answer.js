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

  // Préparer les données pour Prisma
  const formattedAnswers = answers.map((answer) => ({
    content_answer: answer.content_answer,
    is_private: !!answer.is_private, // Convertir en Boolean
    id_question: parseInt(answer.id_question, 10),
    id_student: parseInt(studentId, 10),
  }));

  try {
    // Insérer toutes les réponses
    const createdAnswers = await prisma.answer.createMany({
      data: formattedAnswers,
    });

    res.status(201).json({ message: 'Réponses enregistrées avec succès.', createdAnswers });
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement des réponses :', err);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});


module.exports = router;
