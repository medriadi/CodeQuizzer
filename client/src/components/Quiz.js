import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const QuizPage = () => {
  // Extract quiz ID from route parameters
  const { id } = useParams();
  // Hook to navigate programmatically between routes
  const navigate = useNavigate();
  // Access the authentication context to get the current user's token
  const { auth } = useContext(AuthContext);
  
  // State to hold quiz data
  const [quiz, setQuiz] = useState(null);
  // State to hold user's selected answers
  const [answers, setAnswers] = useState({});
  // State to manage loading status
  const [loading, setLoading] = useState(true);
  // State to store any error messages
  const [error, setError] = useState('');
  // State to store the result after quiz submission
  const [result, setResult] = useState(null);

  // Fetch quiz data when component mounts or the ID changes
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // Make GET request to fetch quiz details, using authentication token
        const res = await axios.get(`/api/quizzes/${id}`, {
          headers: {
            'x-auth-token': auth.token,
          },
        });
        setQuiz(res.data); // Store fetched quiz data in state
        setLoading(false); // Set loading to false after successful fetch
      } catch (err) {
        console.error(err); // Log any errors to console for debugging
        setError('Failed to fetch quiz'); // Set error message
        setLoading(false); // Stop loading on error
      }
    };

    fetchQuiz(); // Invoke the function to fetch quiz data
  }, [id, auth.token]); // Re-run effect if quiz ID or auth token changes

  // Handle change in selected answer for a question
  const handleChange = (questionId, selectedOption) => {
    setAnswers({
      ...answers, // Keep existing answers
      [questionId]: selectedOption, // Update answer for the specific question
    });
  };

  // Handle form submission to submit quiz answers
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Format answers into the required structure for the API
    const formattedAnswers = Object.keys(answers).map((questionId) => ({
      questionId,
      selectedOption: answers[questionId],
    }));

    try {
      // Make POST request to submit quiz answers
      const res = await axios.post(`/api/quizzes/${id}/submit`, {
        answers: formattedAnswers,
      }, {
        headers: {
          'x-auth-token': auth.token, // Include authentication token in headers
        },
      });

      setResult(res.data); // Store the result data in state
    } catch (err) {
      console.error(err); // Log any errors to console for debugging
      setError('Failed to submit answers'); // Set error message
    }
  };

  // Show loading spinner while quiz data is being fetched
  if (loading) return <div>Loading quiz...</div>;
  // Show error message if there was an error fetching or submitting data
  if (error) return <div className="alert alert-danger">{error}</div>;

  // If result data is available, display the quiz results
  if (result) {
    return (
      <div>
        <h2>Quiz Results</h2>
        <p>Your Score: {result.score} / {result.total}</p>
        <hr />
        {/* Map through result details and display question, selected answer, correct answer, and explanations */}
        {result.results.map((resItem, index) => (
          <div key={index} className="mb-3">
            <h5>{index + 1}. {resItem.questionText}</h5>
            <p>Your Answer: {resItem.selectedOption}</p>
            <p>Correct Answer: {resItem.correctAnswer}</p>
            {resItem.explanation && <p><strong>Explanation:</strong> {resItem.explanation}</p>}
            <hr />
          </div>
        ))}
        {/* Button to navigate back to quizzes list */}
        <button className="btn btn-primary" onClick={() => navigate('/quizzes')}>Back to Quizzes</button>
      </div>
    );
  }

  // Render the quiz questions for the user to answer
  return (
    <div>
      <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>
      <form onSubmit={handleSubmit}>
        {/* Map through each question in the quiz and display options */}
        {quiz.questions.map((question, index) => (
          <div key={question._id} className="mb-4">
            <h5>{index + 1}. {question.questionText}</h5>
            {question.options.map((option, idx) => (
              <div className="form-check" key={idx}>
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question_${question._id}`}
                  id={`question_${question._id}_option_${idx}`}
                  value={option}
                  onChange={() => handleChange(question._id, option)} // Update answer state when user selects an option
                  required
                />
                <label className="form-check-label" htmlFor={`question_${question._id}_option_${idx}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        ))}
        {/* Submit button for the quiz */}
        <button type="submit" className="btn btn-success">Submit Quiz</button>
      </form>
    </div>
  );
};

export default QuizPage;
