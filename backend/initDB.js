const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config({ path: '.env' });

const INIT_FLAG = './database/init_done.txt';

async function createDatabase() {
  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  };

  try {
    if (fs.existsSync(INIT_FLAG)) {
      console.log('La base de données est déjà initialisée.');
      return;
    }

    console.log('Connexion au serveur MySQL...');
    const connection = await mysql.createConnection(dbConfig);

    // Créer la base de données
    console.log('Création de la base de données...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);

    // Charger et exécuter le fichier SQL
    console.log('Création des tables dans la base de données...');
    const sql = fs.readFileSync('../database/create_tables.sql', 'utf8');
    await connection.query(`USE ${process.env.DB_NAME}`);
    await connection.query(sql);

    console.log('Exécution du script pour remplir la base de données...');
    const seedScript = require('./insertData');
    await seedScript();

    fs.writeFileSync(INIT_FLAG, 'Database initialized at ' + new Date().toISOString());
    console.log('Initialisation terminée.');

    await connection.end();
  } catch (err) {
    console.error('Erreur lors de la création de la base de données :', err.message);
  }
}

createDatabase();
