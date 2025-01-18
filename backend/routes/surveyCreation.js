const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/auth"); // Middleware pour vérifier le token

// Route pour récupérer les modules avec leur code
router.get("/modulesname", authMiddleware, (req, res) => {
  db.query("SELECT id_module, code_module FROM Module", (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des modules:", err);
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération des modules." });
    }
    res.json(results);
  });
});

// Route pour récupérer les groupes d'étudiants par module
router.get("/student-groups-by-module/:moduleId", authMiddleware, (req, res) => {
  const moduleId = req.params.moduleId;

  db.query(
    `
    SELECT sg.id_student_group, sg.name_student_group
    FROM Student_Group sg
    JOIN Group_Module gm ON sg.id_student_group = gm.id_student_group
    WHERE gm.id_module = ?
  `,
    [moduleId],
    (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération des groupes d'étudiants pour le module:",
          err
        );
        return res
          .status(500)
          .json({
            error:
              "Erreur lors de la récupération des groupes d'étudiants pour ce module.",
          });
      }
      res.json(results);
    }
  );
});

// Route pour créer un sondage
router.post("/surveys", authMiddleware, (req, res) => {
  const { module, studentGroup, startDate, endDate, questions, title } =
    req.body;

  if (
    !module ||
    !studentGroup ||
    !startDate ||
    !endDate ||
    questions.length === 0 ||
    !title
  ) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  const formattedStartDate = new Date(startDate).toISOString().split("T")[0];
  const formattedEndDate = new Date(endDate).toISOString().split("T")[0];

  // Étape 1 : Insérer l'évaluation
  const evaluationQuery = `
    INSERT INTO evaluation (date_opening, date_closing, title_evaluation, id_student_group)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    evaluationQuery,
    [formattedStartDate, formattedEndDate, title, studentGroup],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de l'insertion de l'évaluation :", err);
        return res
          .status(500)
          .json({ error: "Erreur lors de la création de l'évaluation." });
      }

      const evaluationId = result.insertId; // ID de l'évaluation nouvellement créée

      // Étape 2 : Insérer les questions
      const questionsQuery = `
        INSERT INTO question (type_question, title_question, content_question, id_evaluation)
        VALUES ?
      `;

      const questionsData = questions.map((q) => [
        q.type === "text" ? 1 : 2, // 1 pour texte, 2 pour une note
        q.title, // Titre de la question
        q.content, // Contenu de la question
        evaluationId, // ID de l'évaluation associée
      ]);

      db.query(questionsQuery, [questionsData], (err) => {
        if (err) {
          console.error("Erreur lors de l'insertion des questions :", err);
          return res
            .status(500)
            .json({ error: "Erreur lors de l'ajout des questions." });
        }

        res
          .status(201)
          .json({ message: "Sondage et questions créés avec succès !" });
      });
    }
  );
});

module.exports = router;
