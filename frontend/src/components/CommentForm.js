// src/components/CommentForm.js
import React, { useState } from 'react';
import { TextField, Button, FormControlLabel, Checkbox } from '@mui/material';

const CommentForm = ({ onPostComment }) => {
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = () => {
    onPostComment(newComment, isAnonymous);
    setNewComment(''); // Réinitialiser le champ de saisie
    setIsAnonymous(false); // Réinitialiser l'état d'anonymat
  };

  return (
    <div className="feedback-form">
      <TextField
        fullWidth
        className="comment-input"
        variant="outlined"
        label="Your comment"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        multiline
        rows={3}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            color="primary"
          />
        }
        label="Post anonymously"
      />
      <Button
        className="comment-button"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        Post a comment
      </Button>
    </div>
  );
};

export default CommentForm;
