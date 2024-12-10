// components/ModuleList.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export const ModuleList = ({ modules, navigate }) => (
  <Box sx={{ flex: 1, marginLeft: '20px' }}>
    <Typography variant="h6" align="center" sx={{ mb: 3 }}>
      Modules
    </Typography>
    {modules.length === 0 ? (
      <Typography variant="body1" align="center">
        No modules available at the moment.
      </Typography>
    ) : (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {modules.map((module) => (
          <Box
            key={module.id_module}
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
            <Typography variant="subtitle1">{module.name_module}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/module/${module.id_module}/comments`)}
            >
              View Feedbacks
            </Button>
          </Box>
        ))}
      </Box>
    )}
  </Box>
);
