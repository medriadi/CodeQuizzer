import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { AuthContext } from '../context/AuthContext';

const QuizPage = () => {
  const { id } = useParams(); // Extract quiz ID from the route parameters
  const navigate = useNavigate(); // Hook to programmatically navigate between routes
  const { auth } = useContext(AuthContext); // Access authentication context to get user's authentication status

  const [quiz, setQuiz] = useState(null); // State to store quiz data fetched from the server
  const [answers, setAnswers] = useState({}); // State to store user's selected answers
  const [loading, setLoading] = useState(true); // State to manage loading status while data is being fetched
  const [error, setError] = useState(''); // State to store any error messages during data fetching or submission
  const [result, setResult] = useState(null); // State to store the quiz results after submission
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // State to track the current question index for navigation

  useEffect(() => {
    // Function to fetch quiz data from the backend
    const fetchQuiz = async () => {
      try {
        // Make a GET request to fetch quiz data using the quiz ID from the URL
        const res = await axiosInstance.get(`/api/quizzes/${id}`);
        setQuiz(res.data); // Set the quiz data to state
        setLoading(false); // Set loading to false as data has been successfully fetched
      } catch (err) {
        console.error(err); // Log error for debugging purposes
        setError('Failed to fetch quiz'); // Set error message in case of failure
        setLoading(false); // Stop loading if an error occurs
      }
    };

    fetchQuiz(); // Call the function to fetch quiz data when component mounts
  }, [id]); // Dependency array includes quiz ID to refetch if ID changes

  // Function to handle answer selection by the user
  const handleChange = (questionId, selectedOption) => {
    setAnswers({
      ...answers, // Preserve previously selected answers
      [questionId]: selectedOption, // Update the answer for the specified question
    });
  };

  // Function to handle quiz submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(''); // Clear any previous error messages

    // Format the user's answers into the required structure for the API
    const formattedAnswers = Object.keys(answers).map((questionId) => ({
      questionId,
      selectedOption: answers[questionId],
    }));

    try {
      // Make a POST request to submit the user's answers
      const res = await axiosInstance.post(`/api/quizzes/${id}/submit`, {
        answers: formattedAnswers,
      });
      setResult(res.data); // Store the results in the state after successful submission
    } catch (err) {
      console.error(err); // Log error to console for debugging purposes
      setError('Failed to submit answers'); // Set error message if submission fails
    }
  };

  // Display loading spinner while quiz data is being fetched
  if (loading) return <div className="text-center mt-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  // Display error message if there was an error during fetching or submission
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  // If quiz results are available, display the results
  if (result) {
    return (
      <div>
        <h2 className="text-center my-4">Quiz Results</h2>
        <p className="text-center">Your Score: {result.score} / {result.total}</p>
        <hr />
        {/* Iterate through the results and display each question along with user's answer, correct answer, and explanation */}
        {result.results.map((resItem, index) => (
          <div key={index} className="mb-3">
            <h5>{index + 1}. {resItem.questionText}</h5>
            <p>Your Answer: {resItem.selectedOption}</p>
            <p>Correct Answer: {resItem.correctAnswer}</p>
            {resItem.explanation && <p><strong>Explanation:</strong> {resItem.explanation}</p>}
            <hr />
          </div>
        ))}
        {/* Button to navigate back to the list of quizzes */}
        <button className="btn btn-primary w-100 mt-3" onClick={() => navigate('/quizzes')}>Back to Quizzes</button>
      </div>
    );
  }

  // Render the quiz for the user to answer
  return (
    <div>
      <h2 className="text-center my-4">{quiz.title}</h2>
      <p className="text-center">{quiz.description}</p>
      <div className="progress mb-4">
        {/* Progress bar to show how far along the user is in the quiz */}
        <div className="progress-bar" role="progressbar" style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Render each question based on the current question index */}
        {quiz.questions.map((question, index) => (
          <div key={question._id} className={`mb-4 ${index === currentQuestionIndex ? '' : 'd-none'}`}> {/* Only show the current question */}
            <h5>{index + 1}. {question.questionText}</h5>
            {question.options.map((option, idx) => (
              <div className="form-check" key={idx}>
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question_${question._id}`}
                  id={`question_${question._id}_option_${idx}`}
                  value={option}
                  onChange={() => handleChange(question._id, option)} // Update the answer state when an option is selected
                  required
                />
                <label className="form-check-label" htmlFor={`question_${question._id}_option_${idx}`}>{option}</label>
              </div>
            ))}
          </div>
        ))}
        <div className="d-flex justify-content-between">
          {/* Button to navigate to the previous question */}
          <button
            type="button"
            className="btn btn-secondary"
            disabled={currentQuestionIndex === 0} // Disable if on the first question
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          >Previous</button>
          {/* Button to navigate to the next question or submit the quiz */}
          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            >Next</button>
          ) : (
            <button type="submit" className="btn btn-success">Submit Quiz</button> // Submit button when on the last question
          )}
        </div>
      </form>
    </div>
  );
};

export default QuizPage;
