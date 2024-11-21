import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import '../index.css';

const EvaluationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/evaluation/${id}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données.');
        }

        const data = await response.json();
        setEvaluation(data.evaluation);
        setQuestions(data.questions);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [id]);

  const handleInputChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value, // Associe la réponse à l'ID de la question
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentId = localStorage.getItem('studentId'); // Récupérez l'ID de l'étudiant connecté

    if (!studentId) {
      console.error('Aucun ID étudiant trouvé.');
      alert('Vous devez être connecté pour soumettre vos réponses.');
      return;
    }

    const answers = Object.keys(responses).map((questionId) => ({
      content_answer: responses[questionId],
      id_question: parseInt(questionId, 10),
      is_private: 0, // Par défaut, non privé
    }));

    try {
      const response = await fetch('http://localhost:5000/api/submit-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers, studentId }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement des réponses.');
      }

      const data = await response.json();
      console.log(data.message);
      navigate('/dashboard'); // Redirige après soumission
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="evaluation-page">
      <div className="evaluation-form-container">
        <form className="evaluation-form" onSubmit={handleSubmit}>
          <h1>{evaluation.title_evaluation}</h1>
          {questions.map((question) => (
            <div key={question.id_question} className="question-container">
              <h3>{question.title_question}</h3>
              <p>{question.content_question}</p>
              {question.type_question === 1 ? (
                // Champ de texte pour les questions ouvertes
                <textarea
                  name={`question_${question.id_question}`}
                  placeholder="Votre réponse..."
                  rows="4"
                  cols="50"
                  value={responses[question.id_question] || ''}
                  onChange={(e) => handleInputChange(question.id_question, e.target.value)}
                ></textarea>
              ) : question.type_question === 2 ? (
                // Boutons radio pour les questions fermées
                <FormControl>
                  <RadioGroup
                    row
                    name={`question_${question.id_question}`}
                    value={responses[question.id_question] || ''}
                    onChange={(e) => handleInputChange(question.id_question, e.target.value)}
                  >
                    {[...Array(5)].map((_, index) => (
                      <FormControlLabel
                        key={index + 1}
                        value={String(index + 1)}
                        control={<Radio
                            sx={{
                              color: '#c0cae3', // Couleur par défaut
                              '&.Mui-checked': {
                                color: '#c0cae3', // Couleur lorsque le bouton est sélectionné
                              },
                            }}
                          />}
                        label={String(index + 1)}
                        sx={{
                            color: '#c0cae3', // Couleur des labels
                            '& .MuiFormControlLabel-label': {
                              color: '#c0cae3', // Application au texte du label
                            },
                          }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              ) : null}
            </div>
          ))}
          <button type="submit">Envoyer</button>
        </form>
      </div>
    </div>
  );
};

export default EvaluationForm;
