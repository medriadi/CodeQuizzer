import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

const Leaderboard = () => {
  // State to store leaderboard data fetched from the API
  const [leaderboard, setLeaderboard] = useState([]);
  // State to handle the loading status of the leaderboard
  const [loading, setLoading] = useState(true);
  // State to store any errors that occur during the data fetch
  const [error, setError] = useState('');
  // State to track the number of retry attempts in case of a failed request
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Function to fetch leaderboard data from the server
    const fetchLeaderboard = async () => {
      try {
        // Make a GET request to the leaderboard endpoint
        const res = await axiosInstance.get('/api/leaderboard');
        // Store the fetched data in the leaderboard state
        setLeaderboard(res.data);
        // Set loading to false since data has been successfully fetched
        setLoading(false);
      } catch (err) {
        console.error(err); // Log any errors that occur
        // Retry up to 3 times if an error occurs during the fetch
        if (retryCount < 3) {
          setRetryCount(retryCount + 1); // Increment the retry count
        } else {
          // If all retries fail, set an error message and stop loading
          setError('Failed to fetch leaderboard');
          setLoading(false);
        }
      }
    };

    fetchLeaderboard(); // Call the function to fetch leaderboard data
  }, [retryCount]); // Retry fetch when retryCount changes

  // If the data is still loading, show a loading spinner
  if (loading)
    return (
      <div className="text-center mt-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  // If an error occurred, display the error message
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div>
      <h2 className="text-center my-4">Leaderboard</h2>
      <div className="row">
        {/* Iterate over the leaderboard data to render each user */}
        {leaderboard.map((user, index) => (
          <div className="col-md-4 mb-3" key={user.username}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">
                  {/* Display the user's rank and username */}
                  {index + 1}. {user.username}
                  <span className="badge bg-secondary float-end">
                    Rank {index + 1} {/* Display the rank as a badge */}
                  </span>
                </h5>
                {/* Display the user's average score percentage */}
                <p className="card-text">
                  Average Score: {user.averagePercentage}%
                </p>
                {/* Display the number of quizzes the user has taken */}
                <p className="card-text">Quizzes Taken: {user.numQuizzes}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
