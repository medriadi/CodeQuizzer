import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    let active = true;
    const fetchQuiz = async () => {
      try {
        const response = await axiosInstance.get(`/api/quizzes/${id}`);
        if (active) {
          setQuiz(response.data);
          setLoading(false);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.response?.data?.msg || 'Failed to fetch quiz');
          setLoading(false);
        }
      }
    };
    fetchQuiz();
    return () => {
      active = false;
    };
  }, [id]);

  const handleChange = (questionId, selectedOption) => {
    setAnswers((previous) => ({ ...previous, [questionId]: selectedOption }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (Object.keys(answers).length !== quiz.questions.length) {
      setError('Please answer every question before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const formattedAnswers = quiz.questions.map((question) => ({
        questionId: question._id,
        selectedOption: answers[question._id],
      }));
      const response = await axiosInstance.post(`/api/quizzes/${id}/submit`, {
        answers: formattedAnswers,
      });
      setResult(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.msg || 'Failed to submit answers');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  }
  if (error && !quiz) return <div className="alert alert-danger mt-4">{error}</div>;
  if (result) {
    return (
      <div>
        <h2 className="text-center my-4">Quiz Results</h2>
        <p className="text-center">Your Score: {result.score} / {result.total}</p>
        {result.results.map((item, index) => (
          <div key={item.questionId} className="mb-3">
            <h5>{index + 1}. {item.questionText}</h5>
            <p>Your Answer: {item.selectedOption}</p>
            <p>Correct Answer: {item.correctAnswer}</p>
            {item.explanation && <p><strong>Explanation:</strong> {item.explanation}</p>}
            <hr />
          </div>
        ))}
        <button className="btn btn-primary w-100" onClick={() => navigate('/quizzes')}>Back to Quizzes</button>
      </div>
    );
  }

  const question = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  return (
    <div>
      <h2 className="text-center my-4">{quiz.title}</h2>
      <p className="text-center">{quiz.description}</p>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="progress mb-4" aria-label="Quiz progress">
        <div className="progress-bar" role="progressbar" style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend className="h5">{currentQuestionIndex + 1}. {question.questionText}</legend>
          {question.options.map((option, index) => (
            <div className="form-check" key={option}>
              <input
                className="form-check-input"
                type="radio"
                name={`question_${question._id}`}
                id={`question_${question._id}_option_${index}`}
                value={option}
                checked={answers[question._id] === option}
                onChange={() => handleChange(question._id, option)}
                required
              />
              <label className="form-check-label" htmlFor={`question_${question._id}_option_${index}`}>{option}</label>
            </div>
          ))}
        </fieldset>
        <div className="d-flex justify-content-between mt-4">
          <button type="button" className="btn btn-secondary" disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex((index) => index - 1)}>Previous</button>
          {isLastQuestion ? (
            <button type="submit" className="btn btn-success" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Quiz'}</button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => setCurrentQuestionIndex((index) => index + 1)}>Next</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuizPage;
