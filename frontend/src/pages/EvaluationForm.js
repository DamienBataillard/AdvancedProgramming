import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../index.css'; // Import du fichier CSS global

const EvaluationForm = () => {
  const { id } = useParams();
  const [evaluation, setEvaluation] = useState(null);
  const [questions, setQuestions] = useState([]);
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

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="evaluation-page">
      <div className="evaluation-form-container">
        <form className="evaluation-form">
          <h1>{evaluation.title_evaluation}</h1>
          {questions.map((question) => (
            <div key={question.id_question} className="question-container">
              <h3>{question.title_question}</h3>
              <p>{question.content_question}</p>
              <textarea
                name={`question_${question.id_question}`}
                placeholder="Votre réponse..."
                rows="4"
                cols="50"
              ></textarea>
            </div>
          ))}
          <button type="submit">Envoyer</button>
        </form>
      </div>
    </div>
  );
};

export default EvaluationForm;
