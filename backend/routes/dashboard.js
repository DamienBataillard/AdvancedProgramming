const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', authMiddleware, (req, res) => {
    console.log('Utilisateur autorisé:', req.user); // Log des informations de l'utilisateur
  
    res.status(200).json({
      message: 'Bienvenue sur le tableau de bord',
      user: req.user,
    });
  });
  

module.exports = router;
