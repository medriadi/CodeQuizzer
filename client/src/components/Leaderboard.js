import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('/api/leaderboard');
        setLeaderboard(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (retryCount < 3) {
          setRetryCount(retryCount + 1);
        } else {
          setError('Failed to fetch leaderboard');
          setLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(fetchLeaderboard, 1000);

    return () => clearTimeout(timeoutId);
  }, [retryCount]);

  if (loading) return <div className="text-center mt-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div>
      <h2 className="text-center my-4">Leaderboard</h2>
      <div className="row">
        {leaderboard.map((user, index) => (
          <div className="col-md-4 mb-3" key={index}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">
                  {index + 1}. {user.username}
                  <span className="badge bg-secondary float-end">Rank {index + 1}</span>
                </h5>
                <p className="card-text">Highest Score: {user.highestScore}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
