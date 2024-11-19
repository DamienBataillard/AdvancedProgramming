const express = require('express');
const registerRoutes = require('../routes/register'); // Import des routes pour Register
const loginRoutes = require('../routes/login'); // Import des routes pour Login
require('dotenv').config();
const db = require('./db'); // Assurez-vous que db.js est importé correctement
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware pour analyser les données JSON
app.use(express.json());
app.use(cors()); // Autorise toutes les origines par défaut

// Intégration des routes
app.use('/api', registerRoutes);
app.use('/api', loginRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
