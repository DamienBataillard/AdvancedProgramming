const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Middleware pour vérifier le token

// Route pour SurveyCreation
router.get('/survey-creation', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'Accès autorisé pour SurveyCreation',
    user: req.user, // Données de l'utilisateur décodées depuis le token
  });
});

module.exports = router;
