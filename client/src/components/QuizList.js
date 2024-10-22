import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { Link } from 'react-router-dom';

const QuizList = () => {
  // State to store fetched quizzes data
  const [quizzes, setQuizzes] = useState([]);
  // State to manage loading status while fetching data
  const [loading, setLoading] = useState(true);
  // State to store any error messages during the data fetch
  const [error, setError] = useState('');

  // useEffect to fetch quizzes from the backend API when the component mounts
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // Make a GET request to fetch the list of quizzes
        const res = await axiosInstance.get('/api/quizzes');
        setQuizzes(res.data); // Store fetched quizzes in the state
        setLoading(false); // Set loading to false after fetching data
      } catch (err) {
        console.error(err); // Log any errors that occur during the fetch
        setError('Failed to fetch quizzes'); // Set error message if fetching fails
        setLoading(false); // Stop loading in case of an error
      }
    };

    fetchQuizzes(); // Call the function to fetch quizzes
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  // Show loading spinner while data is being fetched
  if (loading)
    return (
      <div className="text-center mt-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  
  // Show error message if there is an error during data fetching
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div>
      <h2 className="text-center my-4">Available Quizzes</h2>
      <div className="row">
        {/* Iterate over quizzes and render each quiz card */}
        {quizzes.map((quiz) => (
          <div className="col-md-4 mb-4" key={quiz._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{quiz.title}</h5> {/* Display quiz title */}
                <p className="card-text">{quiz.description}</p> {/* Display quiz description */}
                {/* Link to start the selected quiz */}
                <Link to={`/quizzes/${quiz._id}`} className="btn btn-primary">
                  Start Quiz
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
