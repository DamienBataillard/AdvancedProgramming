const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config({ path: '.env' });

async function createDatabase() {
  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  };

  try {
    console.log('Connexion au serveur MySQL...');
    const connection = await mysql.createConnection(dbConfig);

    console.log('Création de la base de données...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);

    console.log('Vérification de l’état de la base de données...');
    const initLogTableQuery = `
      CREATE TABLE IF NOT EXISTS init_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        initialized_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.query(initLogTableQuery);

    const [rows] = await connection.query(`SELECT * FROM init_log LIMIT 1`);
    if (rows.length > 0) {
      console.log('La base de données est déjà initialisée.');
      await connection.end();
      return;
    }

    console.log('Création des tables...');
    const tableCreationQueries = [
      `CREATE TABLE IF NOT EXISTS role (
        id_role INT AUTO_INCREMENT PRIMARY KEY,
        name_role VARCHAR(50) NOT NULL UNIQUE
      )`,
      `CREATE TABLE IF NOT EXISTS profile (
        id_profile INT AUTO_INCREMENT PRIMARY KEY,
        mail_profile VARCHAR(255) NOT NULL UNIQUE,
        date_of_birth_profile DATE DEFAULT NULL,
        img_profile TEXT,
        password_profile VARCHAR(255) NOT NULL,
        first_name_profile VARCHAR(255) NOT NULL,
        last_name_profile VARCHAR(255) NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS profile_role (
        id_profile INT NOT NULL,
        id_role INT NOT NULL,
        PRIMARY KEY (id_profile, id_role),
        FOREIGN KEY (id_profile) REFERENCES profile (id_profile) ON DELETE CASCADE,
        FOREIGN KEY (id_role) REFERENCES role (id_role) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS notification (
        id_notification INT AUTO_INCREMENT PRIMARY KEY,
        message TEXT NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        id_profile INT NOT NULL,
        FOREIGN KEY (id_profile) REFERENCES profile (id_profile) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS student_group (
        id_student_group INT AUTO_INCREMENT PRIMARY KEY,
        name_student_group VARCHAR(255) NOT NULL,
        year_student_group INT NOT NULL,
        semester_student_group INT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS evaluation (
        id_evaluation INT AUTO_INCREMENT PRIMARY KEY,
        date_opening DATE NOT NULL,
        date_closing DATE NOT NULL,
        title_evaluation VARCHAR(255) NOT NULL,
        id_student_group INT NOT NULL,
        FOREIGN KEY (id_student_group) REFERENCES student_group (id_student_group) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS student_group_association (
        id_student INT NOT NULL,
        id_student_group INT NOT NULL,
        PRIMARY KEY (id_student, id_student_group),
        FOREIGN KEY (id_student) REFERENCES profile (id_profile) ON DELETE CASCADE,
        FOREIGN KEY (id_student_group) REFERENCES student_group (id_student_group) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS module (
        id_module INT AUTO_INCREMENT PRIMARY KEY,
        code_module VARCHAR(50) NOT NULL UNIQUE,
        name_module VARCHAR(255) NOT NULL,
        professor_module VARCHAR(255) NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS group_module (
        id_student_group INT NOT NULL,
        id_module INT NOT NULL,
        PRIMARY KEY (id_student_group, id_module),
        FOREIGN KEY (id_student_group) REFERENCES student_group (id_student_group) ON DELETE CASCADE,
        FOREIGN KEY (id_module) REFERENCES module (id_module) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS question (
        id_question INT AUTO_INCREMENT PRIMARY KEY,
        type_question INT NOT NULL,
        title_question VARCHAR(255) NOT NULL,
        content_question TEXT NOT NULL,
        id_evaluation INT NOT NULL,
        FOREIGN KEY (id_evaluation) REFERENCES evaluation (id_evaluation) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS answer (
        id_answer INT AUTO_INCREMENT PRIMARY KEY,
        note_answer INT DEFAULT NULL,
        content_answer TEXT,
        is_private TINYINT(1) NOT NULL,
        id_question INT NOT NULL,
        id_student INT NOT NULL,
        FOREIGN KEY (id_question) REFERENCES question (id_question) ON DELETE CASCADE,
        FOREIGN KEY (id_student) REFERENCES profile (id_profile) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS comment (
        id_comment INT AUTO_INCREMENT PRIMARY KEY,
        content_comment TEXT NOT NULL,
        is_anonymous TINYINT(1) DEFAULT '0',
        date_comment DATE NOT NULL,
        id_module INT NOT NULL,
        id_author INT DEFAULT NULL,
        FOREIGN KEY (id_author) REFERENCES profile (id_profile) ON DELETE CASCADE,
        FOREIGN KEY (id_module) REFERENCES module (id_module) ON DELETE CASCADE
      )`
    ];

    for (const query of tableCreationQueries) {
      await connection.query(query);
    }

    console.log('Insertion des données...');
    const seedScript = require('./insertData');
    await seedScript();

    console.log('Marquage de l’initialisation...');
    await connection.query(`INSERT INTO init_log (initialized_at) VALUES (NOW())`);

    console.log('Initialisation terminée.');
    await connection.end();
  } catch (err) {
    console.error('Erreur lors de la création de la base de données :', err.message);
  }
}

createDatabase();
