import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { fetchComments, postComment } from '../services/apiService';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import '../index.css';

function FeedbackPage() {
  const { moduleId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments(moduleId);
        setComments(data);
        console.log(data)
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadComments();
  }, [moduleId]);

  const handlePostComment = async (newComment, isAnonymous) => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) return;

    try {
      await postComment({
        moduleId,
        content_comment: newComment,
        id_student: studentId,
      });

      const displayName = isAnonymous ? 'Anonyme' : localStorage.getItem('userName');
      setComments([...comments, { content_comment: newComment, name_profile: displayName }]);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <Box className="feedback-page" sx={{ padding: '20px' }}>
      <Typography variant="h4" className="feedback-title" gutterBottom>
        Feedbacks for Module
      </Typography>
      <CommentList comments={comments} />
      <CommentForm onPostComment={handlePostComment} />
    </Box>
  );
}

export default FeedbackPage;
