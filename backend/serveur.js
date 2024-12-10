const express = require('express');
const registerRoutes = require('./routes/register'); // Import des routes pour Register
const loginRoutes = require('./routes/login'); // Import des routes pour Login
require('dotenv').config();
const db = require('./config/db'); // Assurez-vous que db.js est importé correctement
const cors = require('cors');
const authMiddleware = require('./middleware/auth'); // Import du middleware
const evaluationRoutes = require('./routes/evaluation');
const answerRoutes = require('./routes/answer');
const feedbackRoutes = require('./routes/feedback');
const moduleRoutes = require('./routes/modules');
const userRoutes = require('./routes/user')
const profil = require ('./routes/profil')

const app = express();
const PORT = 5000;

// Middleware pour analyser les données JSON
app.use(express.json());
app.use(cors()); // Autorise toutes les origines par défaut

// Intégration des routes
app.use('/api', registerRoutes);
app.use('/api', profil);
app.use('/api', loginRoutes);
app.use('/api', evaluationRoutes);
app.use('/api', answerRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', moduleRoutes);
app.use('/api', userRoutes);
app.get('/api/dashboard', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'Bienvenue sur le tableau de bord',
    user: req.user, // Données utilisateur décodées à partir du token
  });
});
app.get('/api/profil', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'Bienvenue sur le tableau de bord',
    user: req.user, // Données utilisateur décodées à partir du token
  });
});
app.get('/api/survey-creation', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Accès autorisé pour SurveyCreation' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
