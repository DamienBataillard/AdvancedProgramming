import { useParams } from 'react-router-dom';
import { useSurveyAnswers } from '../hooks/useSurveyAnswers';
import PrimarySearchAppBar from '../components/AppBar';

const SurveyAnswers = () => {
  const { professorname, surveyId } = useParams();

  const { answers, loading, error } = useSurveyAnswers(professorname, surveyId);

  if (loading) return <p>Chargement des réponses...</p>;
  if (error) return <p>Erreur : {error}</p>;

  // Regrouper les réponses par question
  const groupedAnswers = answers.reduce((acc, answer) => {
    if (!acc[answer.content_question]) {
      acc[answer.content_question] = [];
    }
    acc[answer.content_question].push(answer);
    return acc;
  }, {});

  return (
    <div className='App'>
    <PrimarySearchAppBar />
      <div className="survey-answers-page">
        <h1 className="survey-answers-title">Réponses au survey {surveyId}</h1>
        <div className="survey-answers-container">
          {Object.entries(groupedAnswers).map(([question, responses]) => (
            <div key={question} className="survey-answers-group">
              <h3 className="survey-answers-question">{question}</h3>
              <ul className="survey-answers-list">
                {responses.map((response, index) => (
                  <li key={index} className="survey-answers-item">
                    <span className="survey-answers-student">
                      {response.first_name_profile} {response.last_name_profile}
                    </span>
                    : {response.content_answer}{' '}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurveyAnswers;
