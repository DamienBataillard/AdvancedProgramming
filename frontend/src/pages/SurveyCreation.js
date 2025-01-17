import React, { useState, useEffect } from "react";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import PrimarySearchAppBar from "../components/AppBar";
import { fetchModules, fetchTeachers, fetchStudentGroups } from "../services/apiService";

const SurveyCreation = () => {
  const [module, setModule] = useState("");
  const [teacher, setTeacher] = useState("");
  const [studentGroup, setStudentGroup] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [modules, setModules] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [studentGroups, setStudentGroups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const modulesData = await fetchModules();
        const teachersData = await fetchTeachers();
        const studentGroupsData = await fetchStudentGroups();

        setModules(modulesData);
        setTeachers(teachersData);
        setStudentGroups(studentGroupsData);
      } catch (err) {
        console.error("Erreur lors du chargement des données :", err);
      }
    };

    fetchData();
  }, []);

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
                {modules.map((mod) => (
                  <MenuItem key={mod.id} value={mod.id}>
                    {mod.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Sélection de l'enseignant */}
            <FormControl fullWidth>
              <InputLabel>Select Teacher</InputLabel>
              <Select value={teacher} onChange={(e) => setTeacher(e.target.value)}>
                {teachers.map((teach) => (
                  <MenuItem key={teach.id} value={teach.id}>
                    {teach.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Sélection du groupe */}
            <FormControl fullWidth>
              <InputLabel>Select Student Group</InputLabel>
              <Select value={studentGroup} onChange={(e) => setStudentGroup(e.target.value)}>
                {studentGroups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
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
    </div>
  );
};

export default SurveyCreation;
