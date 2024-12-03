import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';

function FeedbackPage() {
  const { moduleId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/module/${moduleId}/comments`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des commentaires.');
        }

        const data = await response.json();
        setComments(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchComments();
  }, [moduleId]);

  const handlePostComment = async () => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/module/${moduleId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_comment: newComment, id_student: studentId }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l’ajout du commentaire.');
      }

      setNewComment('');
      setComments([...comments, { content_comment: newComment, id_student: studentId }]);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Feedbacks for Module
      </Typography>
      <Box sx={{ marginBottom: '20px' }}>
        {comments.length === 0 ? (
          <Typography>Aucun commentaire pour ce module.</Typography>
        ) : (
          comments.map((comment, index) => (
            <Box
              key={index}
              sx={{
                padding: '10px',
                backgroundColor: '#f9f9f9',
                marginBottom: '10px',
                borderRadius: '5px',
                boxShadow: 1,
              }}
            >
              <Typography variant="body1">{comment.content_comment}</Typography>
              <Typography variant="caption" color="text.secondary">
                Posté par : {comment.name_profile}
              </Typography>
            </Box>
          ))
        )}
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        label="Votre commentaire"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        multiline
        rows={3}
        sx={{ marginBottom: '20px' }}
      />
      <Button variant="contained" color="primary" onClick={handlePostComment}>
        Poster un commentaire
      </Button>
    </Box>
  );
}

export default FeedbackPage;

