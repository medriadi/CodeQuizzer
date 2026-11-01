import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

const Leaderboard = () => {
  const [rows, setRows] = useState([]);
  const [state, setState] = useState({ loading: true, error: '' });
  useEffect(() => {
    axiosInstance.get('/api/leaderboard').then(({ data }) => setRows(data)).catch(() => setState({ loading: false, error: 'Unable to load the leaderboard.' })).finally(() => setState((previous) => ({ ...previous, loading: false })));
  }, []);
  if (state.loading) return <div className="center-state"><span className="loader" /> Loading leaderboard...</div>;
  if (state.error) return <div className="page-narrow"><div className="alert alert-error">{state.error}</div></div>;
  return <section className="page-section page-narrow"><div className="section-heading"><div><p className="eyebrow">THE COMMUNITY</p><h1>Leaderboard</h1></div><p>Consistency compounds. See how other learners are doing.</p></div><div className="leaderboard">{rows.length === 0 ? <div className="empty-state">Complete a quiz to claim your spot.</div> : rows.map((row, index) => <div className={`leader-row ${index === 0 ? 'leader-first' : ''}`} key={row.username}><span className="leader-rank">{String(index + 1).padStart(2, '0')}</span><span className="leader-name">{row.username}{index === 0 && <em>Top performer</em>}</span><strong>{row.averagePercentage}%</strong><span>{row.quizzesTaken} quizzes</span></div>)}</div></section>;
};

export default Leaderboard;
