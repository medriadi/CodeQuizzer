import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('/api/quizzes');
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

  if (loading) return <div>Loading quizzes...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2>Available Quizzes</h2>
      <div className="list-group">
        {quizzes.map((quiz) => (
          <Link
            key={quiz._id}
            to={`/quizzes/${quiz._id}`}
            className="list-group-item list-group-item-action"
          >
            <h5>{quiz.title}</h5>
            <p>{quiz.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
