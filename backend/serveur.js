const express = require('express');
require('dotenv').config();
const cors = require('cors');
const prisma = require('./prismaClient'); // Prisma pour interagir avec la base de données
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const evaluationRoutes = require('./routes/evaluation');
const answerRoutes = require('./routes/answer');
const feedbackRoutes = require('./routes/feedback');
const moduleRoutes = require('./routes/modules');
const userRoutes = require('./routes/user');
const profilRoutes = require('./routes/profil');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connexion à Prisma
prisma.$connect()
  .then(() => console.log('Connecté à la base de données via Prisma.'))
  .catch((err) => {
    console.error('Erreur lors de la connexion à la base de données :', err.message);
    process.exit(1);
  });

// Routes
app.use('/api', registerRoutes);
app.use('/api', loginRoutes);
app.use('/api', profilRoutes);
app.use('/api', evaluationRoutes);
app.use('/api', answerRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', moduleRoutes);
app.use('/api', userRoutes);

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur interne du serveur.' });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
