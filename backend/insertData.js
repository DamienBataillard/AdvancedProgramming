const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config(); // Charger les variables d'environnement

// Charger les données du JSON
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// Configuration de la connexion à la BDD
const dbConfig = {
  host: process.env.DB_HOST,       // Chargé depuis .env
  user: process.env.DB_USER,       // Chargé depuis .env
  password: process.env.DB_PASSWORD, // Chargé depuis .env
  database: process.env.DB_NAME,    // Chargé depuis .env
};

// Fonction pour formater les dates au format MySQL
function formatDateForMySQL(dateString) {
  if (!dateString) return null;
  return new Date(dateString).toISOString().slice(0, 10); // Transforme en 'YYYY-MM-DD'
}

async function insertData() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    console.log('Connexion à la base de données réussie.');

    // Insérer les rôles
    for (const role of data.role) {
      const query = `
        INSERT INTO role (id_role, name_role)
        VALUES (?, ?)
      `;
      await connection.execute(query, [role.id_role, role.name_role]);
    }

    // Insérer les profils
    for (const profile of data.profile) {
      const query = `
        INSERT INTO profile (id_profile, mail_profile, date_of_birth_profile, img_profile, password_profile, first_name_profile, last_name_profile)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await connection.execute(query, [
        profile.id_profile,
        profile.mail_profile,
        formatDateForMySQL(profile.date_of_birth_profile),
        profile.img_profile,
        profile.password_profile,
        profile.first_name_profile,
        profile.last_name_profile,
      ]);
    }

    // Insérer les rôles des profils
    for (const profileRole of data.profile_role) {
      const query = `
        INSERT INTO profile_role (id_profile, id_role)
        VALUES (?, ?)
      `;
      await connection.execute(query, [
        profileRole.id_profile,
        profileRole.id_role,
      ]);
    }

    // Insérer les modules
    for (const module of data.module) {
      const query = `
        INSERT INTO module (id_module, code_module, name_module, professor_module)
        VALUES (?, ?, ?, ?)
      `;
      await connection.execute(query, [
        module.id_module,
        module.code_module,
        module.name_module,
        module.professor_module,
      ]);
    }

    // Insérer les groupes d'étudiants
    for (const studentGroup of data.student_group) {
      const query = `
        INSERT INTO student_group (id_student_group, name_student_group, year_student_group, semester_student_group)
        VALUES (?, ?, ?, ?)
      `;
      await connection.execute(query, [
        studentGroup.id_student_group,
        studentGroup.name_student_group,
        studentGroup.year_student_group,
        studentGroup.semester_student_group,
      ]);
    }

    // Insérer les associations entre étudiants et groupes
    for (const association of data.student_group_association) {
      const query = `
        INSERT INTO student_group_association (id_student, id_student_group)
        VALUES (?, ?)
      `;
      await connection.execute(query, [
        association.id_student,
        association.id_student_group,
      ]);
    }

    // Insérer les évaluations
    for (const evaluation of data.evaluation) {
      const query = `
        INSERT INTO evaluation (id_evaluation, date_opening, date_closing, title_evaluation, id_student_group)
        VALUES (?, ?, ?, ?, ?)
      `;
      await connection.execute(query, [
        evaluation.id_evaluation,
        formatDateForMySQL(evaluation.date_opening),
        formatDateForMySQL(evaluation.date_closing),
        evaluation.title_evaluation,
        evaluation.id_student_group,
      ]);
    }

    // Insérer les questions
    for (const question of data.question) {
      const query = `
        INSERT INTO question (id_question, type_question, title_question, content_question, id_evaluation)
        VALUES (?, ?, ?, ?, ?)
      `;
      await connection.execute(query, [
        question.id_question,
        question.type_question,
        question.title_question,
        question.content_question,
        question.id_evaluation,
      ]);
    }

    // Insérer les réponses
    for (const answer of data.answer) {
      const query = `
        INSERT INTO answer (id_answer, note_answer, content_answer, is_private, id_question, id_student)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await connection.execute(query, [
        answer.id_answer,
        answer.note_answer,
        answer.content_answer,
        answer.is_private,
        answer.id_question,
        answer.id_student,
      ]);
    }

    // Insérer les commentaires
    for (const comment of data.comment) {
      const query = `
        INSERT INTO comment (id_comment, content_comment, is_anonymous, date_comment, id_module, id_author)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await connection.execute(query, [
        comment.id_comment,
        comment.content_comment,
        comment.is_anonymous,
        formatDateForMySQL(comment.date_comment),
        comment.id_module,
        comment.id_author,
      ]);
    }

    // Insérer les relations entre groupes d'étudiants et modules
    for (const groupModule of data.group_module) {
      const query = `
        INSERT INTO group_module (id_student_group, id_module)
        VALUES (?, ?)
      `;
      await connection.execute(query, [
        groupModule.id_student_group,
        groupModule.id_module,
      ]);
    }

    console.log('Insertion des données terminée avec succès.');
  } catch (err) {
    console.error('Erreur lors de l’insertion des données :', err.message);
  } finally {
    await connection.end();
    console.log('Connexion fermée.');
  }
}
module.exports = insertData;
