// src/components/QuestionOpen.js
import React from 'react';

const QuestionOpen = ({ question, value, onChange }) => (
  <textarea
    name={`question_${question.id_question}`}
    placeholder="Your answer..."
    rows="4"
    cols="50"
    value={value || ''}
    onChange={(e) => onChange(question.id_question, e.target.value)}
  ></textarea>
);

export default QuestionOpen;
