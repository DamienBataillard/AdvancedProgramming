import { useParams } from 'react-router-dom';
import { useSurveyAnswers } from '../hooks/useSurveyAnswers';

const SurveyAnswers = () => {
  const { professorname, surveyId } = useParams();

  const { answers, loading, error } = useSurveyAnswers(professorname, surveyId);

  if (loading) return <p>Chargement des réponses...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <h1>Réponses au survey {surveyId}</h1>
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Réponse</th>
            <th>Étudiant</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((answer) => (
            <tr key={answer.id_question}>
              <td>{answer.content_question}</td>
              <td>{answer.content_answer}</td>
              <td>
                {answer.first_name_profile} {answer.last_name_profile}
              </td>
              <td>{new Date(answer.date_answer).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SurveyAnswers;
