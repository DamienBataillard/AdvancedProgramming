import React, { useEffect, useState } from "react";
import { Box, Typography, Select, MenuItem, TextField, Button, FormControl, InputLabel } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useNavigate } from "react-router-dom";

const SurveyCreation = () => {
  const navigate = useNavigate();
  const [module, setModule] = useState("");
  const [teacher, setTeacher] = useState("");
  const [studentGroup, setStudentGroup] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Vérification du token pour restreindre l'accès
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token manquant");
        }
  
        // Nouvelle URL pour le backend spécifique à SurveyCreation
        const response = await fetch("http://localhost:5000/api/survey-creation", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Accès interdit");
        }
      } catch (error) {
        console.error(error.message);
        navigate("/"); // Redirection vers la page de connexion
      }
    };
  
    verifyToken();
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#d6dbee", // Couleur de fond
        padding: 4,
      }}
    >
      {/* En-tête */}
      <Box
        sx={{
          backgroundColor: "#004fa3",
          color: "white",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">EFREI</Typography>
        <Box>
          <Button color="inherit">🔔</Button>
          <Button color="inherit">👤</Button>
        </Box>
      </Box>

      {/* Contenu de la page */}
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
          {/* Panneau gauche */}
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
                <MenuItem value="Module1">Module 1</MenuItem>
                <MenuItem value="Module2">Module 2</MenuItem>
                <MenuItem value="Module3">Module 3</MenuItem>
              </Select>
            </FormControl>

            {/* Sélection de l'enseignant */}
            <FormControl fullWidth>
              <InputLabel>Select Teacher</InputLabel>
              <Select value={teacher} onChange={(e) => setTeacher(e.target.value)}>
                <MenuItem value="Teacher1">Teacher 1</MenuItem>
                <MenuItem value="Teacher2">Teacher 2</MenuItem>
                <MenuItem value="Teacher3">Teacher 3</MenuItem>
              </Select>
            </FormControl>

            {/* Sélection du groupe */}
            <FormControl fullWidth>
              <InputLabel>Select Student Group</InputLabel>
              <Select value={studentGroup} onChange={(e) => setStudentGroup(e.target.value)}>
                <MenuItem value="Group1">Group 1</MenuItem>
                <MenuItem value="Group2">Group 2</MenuItem>
                <MenuItem value="Group3">Group 3</MenuItem>
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

          {/* Panneau droit */}
          <Box
            sx={{
              width: "70%",
              backgroundColor: "#e0e0e0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Survey Preview Area</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SurveyCreation;
