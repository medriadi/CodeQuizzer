import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { Link } from 'react-router-dom';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axiosInstance.get('/api/quizzes');
        setQuizzes(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch quizzes');
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div>
      <h2 className="text-center my-4">Available Quizzes</h2>
      <div className="row">
        {quizzes.map((quiz) => (
          <div className="col-md-4 mb-4" key={quiz._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{quiz.title}</h5>
                <p className="card-text">{quiz.description}</p>
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
