import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`/api/quizzes/${id}`, {
          headers: {
            'x-auth-token': auth.token,
          },
        });
        setQuiz(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch quiz');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, auth.token]);

  const handleChange = (questionId, selectedOption) => {
    setAnswers({
      ...answers,
      [questionId]: selectedOption,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formattedAnswers = Object.keys(answers).map((questionId) => ({
      questionId,
      selectedOption: answers[questionId],
    }));

    try {
      const res = await axios.post(`/api/quizzes/${id}/submit`, {
        answers: formattedAnswers,
      }, {
        headers: {
          'x-auth-token': auth.token,
        },
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to submit answers');
    }
  };

  if (loading) return <div className="text-center mt-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  if (result) {
    return (
      <div>
        <h2 className="text-center my-4">Quiz Results</h2>
        <p className="text-center">Your Score: {result.score} / {result.total}</p>
        <hr />
        {result.results.map((resItem, index) => (
          <div key={index} className="mb-3">
            <h5>{index + 1}. {resItem.questionText}</h5>
            <p>Your Answer: {resItem.selectedOption}</p>
            <p>Correct Answer: {resItem.correctAnswer}</p>
            {resItem.explanation && <p><strong>Explanation:</strong> {resItem.explanation}</p>}
            <hr />
          </div>
        ))}
        <button className="btn btn-primary w-100 mt-3" onClick={() => navigate('/quizzes')}>Back to Quizzes</button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-center my-4">{quiz.title}</h2>
      <p className="text-center">{quiz.description}</p>
      <div className="progress mb-4">
        <div className="progress-bar" role="progressbar" style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((question, index) => (
          <div key={question._id} className={`mb-4 ${index === currentQuestionIndex ? '' : 'd-none'}`}>
            <h5>{index + 1}. {question.questionText}</h5>
            {question.options.map((option, idx) => (
              <div className="form-check" key={idx}>
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question_${question._id}`}
                  id={`question_${question._id}_option_${idx}`}
                  value={option}
                  onChange={() => handleChange(question._id, option)}
                  required
                />
                <label className="form-check-label" htmlFor={`question_${question._id}_option_${idx}`}>{option}</label>
              </div>
            ))}
          </div>
        ))}
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          >Previous</button>
          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            >Next</button>
          ) : (
            <button type="submit" className="btn btn-success">Submit Quiz</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuizPage;
