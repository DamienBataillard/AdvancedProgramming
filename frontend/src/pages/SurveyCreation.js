import React, { useState, useEffect } from "react";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle,} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import PrimarySearchAppBar from "../components/AppBar";
import { fetchModulesNames, fetchStudentGroupsByModule, createSurvey } from "../services/apiService";

const SurveyCreation = () => {
  const [module, setModule] = useState("");
  const [studentGroup, setStudentGroup] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [modules, setModules] = useState([]);
  const [studentGroups, setStudentGroups] = useState([]);

  const [questions, setQuestions] = useState([]); // Liste des questions
  const [open, setOpen] = useState(false); // État du popup
  const [newQuestionTitle, setNewQuestionTitle] = useState(""); // Titre de la question en cours de création
  const [newQuestionContent, setNewQuestionContent] = useState(""); // Contenu de la question
  const [questionType, setQuestionType] = useState("text"); // Type de question ("text" ou "rating")
  const [surveyTitle, setSurveyTitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const modulesData = await fetchModulesNames();
        setModules(modulesData);
      } catch (err) {
        console.error("Erreur lors du chargement des données :", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const selectedModule = modules.find((mod) => mod.id_module === module);
    if (selectedModule) {
      setSurveyTitle(`Feedback for ${selectedModule.code_module}`);
    } else {
      setSurveyTitle("");
    }
  }, [module, modules]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (module) {
          const groupsData = await fetchStudentGroupsByModule(module);
          setStudentGroups(groupsData);
        } else {
          setStudentGroups([]);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des groupes d'étudiants :", err);
      }
    };

    fetchGroups();
  }, [module]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { title: newQuestionTitle, content: newQuestionContent, type: questionType },
    ]);
    setNewQuestionTitle("");
    setNewQuestionContent("");
    setQuestionType("text");
    setOpen(false);
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCreateSurvey = async () => {
    if (!surveyTitle) {
      alert("Le titre du sondage est vide. Veuillez sélectionner un module.");
      return;
    }

    const surveyData = {
      module,
      studentGroup,
      startDate,
      endDate,
      questions,
      title: surveyTitle,
    };

    try {
      const result = await createSurvey(surveyData);
      alert(result.message);
    } catch (err) {
      console.error("Erreur :", err);
      alert("Impossible de créer le sondage. Veuillez réessayer.");
    }
  };

  return (
    <div className="App">
      <PrimarySearchAppBar />
      <div className="dashboard-container">
        <h1 className="title">Welcome to EFREI Feedbacks!</h1>
        <h2 className="subtitle">Create a New Survey</h2>
      </div>
      <Box
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 4, fontWeight: "bold" }}>
          Evaluation Creation
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: 3,
            width: "80%",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "30%",
              padding: 4,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              backgroundColor: "#f5f5f5",
            }}
          >
            {/* Sélection du module */}
            <FormControl fullWidth>
              <InputLabel>Select Module</InputLabel>
              <Select value={module} onChange={(e) => setModule(e.target.value)}>
                {modules.map((mod) => (
                  <MenuItem key={mod.id_module} value={mod.id_module}>
                    {mod.code_module}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Sélection du groupe */}
            <FormControl fullWidth>
              <InputLabel>Select Student Group</InputLabel>
              <Select value={studentGroup} onChange={(e) => setStudentGroup(e.target.value)}>
                {studentGroups.map((group) => (
                  <MenuItem key={group.id_student_group} value={group.id_student_group}>
                    {group.name_student_group}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Sélection des dates */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Evaluation"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <DatePicker
                label="End Evaluation"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Box>

          <Box
            sx={{
              width: "70%",
              backgroundColor: "#e0e0e0",
              display: "flex",
              flexDirection: "column",
              padding: 4,
            }}
          >
            <Typography variant="h6">Survey Preview Area</Typography>
            {questions.map((question, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: "white",
                  padding: 2,
                  marginTop: 2,
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: 1,
                }}
              >
                <Typography>
                  {index + 1}. {question.title} ({question.type === "text" ? "Text" : "Rating 1-5"})
                </Typography>
                <Typography variant="body2" sx={{ marginLeft: 2 }}>
                  {question.content}
                </Typography>
                <Button color="error" onClick={() => handleDeleteQuestion(index)}>
                  Delete
                </Button>
              </Box>
            ))}
          </Box>
        </Box>

        <Button variant="contained" sx={{ marginTop: 2 }} onClick={() => setOpen(true)}>
          Add Question
        </Button>

        {questions.length > 0 && (
          <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={handleCreateSurvey}>
            Create Survey
          </Button>
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Question</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Question Title"
            value={newQuestionTitle}
            onChange={(e) => setNewQuestionTitle(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Question Content"
            value={newQuestionContent}
            onChange={(e) => setNewQuestionContent(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Question Type</InputLabel>
            <Select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="rating">Rating (1-5)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddQuestion} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SurveyCreation;
