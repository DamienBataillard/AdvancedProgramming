// src/components/CommentList.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const CommentList = ({ comments }) => {
  if (comments.length === 0) {
    return <Typography>Aucun commentaire pour ce module.</Typography>;
  }

  return (
    <Box className="feedback-comments" sx={{ marginBottom: '20px' }}>
      {comments.map((comment, index) => (
        <Box
          key={index}
          className="comment-box"
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
            Post by : {comment.first_name_profile}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default CommentList;
