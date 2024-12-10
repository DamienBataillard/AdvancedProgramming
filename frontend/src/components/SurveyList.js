// components/SurveyList.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export const SurveyList = ({ evaluations, navigate }) => (
  <Box sx={{ flex: 1, marginRight: '20px' }}>
    <Typography variant="h6" align="center" sx={{ mb: 3 }}>
      Available Surveys
    </Typography>
    {evaluations.length === 0 ? (
      <Typography variant="body1" align="center">
        No surveys available at the moment.
      </Typography>
    ) : (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {evaluations.map((evaluation) => (
          <Box
            key={evaluation.id_evaluation}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#c0cae3',
              borderRadius: '5px',
              padding: '10px 20px',
              boxShadow: 2,
            }}
          >
            <Typography variant="subtitle1">{evaluation.title_evaluation}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/evaluation/${evaluation.id_evaluation}`)}
            >
              Start
            </Button>
          </Box>
        ))}
      </Box>
    )}
  </Box>
);
