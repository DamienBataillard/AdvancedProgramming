import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { fetchEvaluation, submitAnswers } from '../services/apiService';
import QuestionOpen from '../components/QuestionOpen';
import QuestionClosed from '../components/QuestionClosed'; 
import '../index.css';

const EvaluationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // État pour gérer la soumission


  useEffect(() => {
    const loadEvaluation = async () => {
      try {
        const data = await fetchEvaluation(id);
        setEvaluation(data);   
        setQuestions(data.question);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadEvaluation();
  }, [id]);

  const handleInputChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentId = localStorage.getItem('studentId');

    if (!studentId) {
      alert('Vous devez être connecté pour soumettre vos réponses.');
      return;
    }

    const answers = Object.keys(responses).map((questionId) => ({
      content_answer: responses[questionId],
      id_question: parseInt(questionId, 10),
      is_private: 0,
    }));

    try {
      await submitAnswers(answers, studentId);
      setIsSubmitted(true); // Active le message de confirmation

      // Affiche une alerte et redirige après un délai
      setTimeout(() => {
        alert('Votre évaluation a été soumise avec succès.');
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!evaluation) return <p>Évaluation non trouvée.</p>;

  return (
    <div className="evaluation-page">
      <div className="evaluation-form-container">
        {isSubmitted ? ( // Affichage conditionnel du message de confirmation
          <div className="confirmation-message">
            <h2>Merci d'avoir complété l'évaluation !</h2>
            <p>Vous serez redirigé vers le tableau de bord sous peu...</p>
          </div>
        ) : (
          <form className="evaluation-form" onSubmit={handleSubmit}>
            <h1>{evaluation.title_evaluation}</h1>
            {questions.map((question) => (
              <div key={question.id_question} className="question-container">
                <h3>{question.title_question}</h3>
                <p>{question.content_question}</p>
                {question.type_question === 1 ? (
                  <QuestionOpen
                    question={question}
                    value={responses[question.id_question]}
                    onChange={handleInputChange}
                  />
                ) : question.type_question === 2 ? (
                  <QuestionClosed
                    question={question}
                    value={responses[question.id_question]}
                    onChange={handleInputChange}
                  />
                ) : null}
              </div>
            ))}
            <button type="submit">Send</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EvaluationForm;
