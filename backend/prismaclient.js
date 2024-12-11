const { PrismaClient } = require('@prisma/client');

// Crée une instance unique de PrismaClient
const prisma = new PrismaClient();

// Gestion des événements de déconnexion propre lorsque le serveur se ferme
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = prisma;
