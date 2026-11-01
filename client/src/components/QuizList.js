import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [state, setState] = useState({ loading: true, error: '' });
  useEffect(() => {
    let active = true;
    axiosInstance.get('/api/quizzes')
      .then(({ data }) => active && setQuizzes(data))
      .catch(() => active && setState({ loading: false, error: 'We could not load quizzes right now.' }))
      .finally(() => active && setState((previous) => ({ ...previous, loading: false })));
    return () => { active = false; };
  }, []);

  if (state.loading) return <div className="center-state"><span className="loader" /> Loading quizzes...</div>;
  if (state.error) return <div className="page-narrow"><div className="alert alert-error">{state.error}</div></div>;
  return (
    <section className="page-section">
      <div className="section-heading"><div><p className="eyebrow">THE LIBRARY</p><h1>Choose your next challenge.</h1></div><p>Pick a topic, test your knowledge, and get better one question at a time.</p></div>
      {quizzes.length === 0 ? <div className="empty-state">New quizzes are on the way. Check back soon.</div> : (
        <div className="quiz-grid">{quizzes.map((quiz) => (
          <article className="quiz-card" key={quiz._id}>
            <div className="quiz-card-top"><span className="tag">{quiz.category}</span><span className={`difficulty difficulty-${quiz.difficulty.toLowerCase()}`}>{quiz.difficulty}</span></div>
            <h2>{quiz.title}</h2><p>{quiz.description || 'Sharpen your skills with this focused challenge.'}</p>
            <div className="quiz-card-footer"><span>{quiz.questionCount} questions</span><Link className="button button-small" to={`/quizzes/${quiz._id}`}>Start quiz →</Link></div>
          </article>
        ))}</div>
      )}
    </section>
  );
};

export default QuizList;
