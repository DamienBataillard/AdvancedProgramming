// src/components/QuestionClosed.js
import React from 'react';
import { FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const QuestionClosed = ({ question, value, onChange }) => (
  <FormControl>
    <RadioGroup
      row
      name={`question_${question.id_question}`}
      value={value || ''}
      onChange={(e) => onChange(question.id_question, e.target.value)}
    >
      {[...Array(5)].map((_, index) => (
        <FormControlLabel
          key={index + 1}
          value={String(index + 1)}
          control={
            <Radio
              sx={{
                color: '#c0cae3',
                '&.Mui-checked': {
                  color: '#c0cae3',
                },
              }}
            />
          }
          label={String(index + 1)}
          sx={{
            color: '#c0cae3',
            '& .MuiFormControlLabel-label': {
              color: '#c0cae3',
            },
          }}
        />
      ))}
    </RadioGroup>
  </FormControl>
);

export default QuestionClosed;
