import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfileAndQuizzes = async () => {
      try {
        // Fetch user profile
        const profileRes = await axios.get('/api/profile', {
          headers: {
            'x-auth-token': auth.token,
          },
        });
        setProfile(profileRes.data);
        setFormData({
          username: profileRes.data.username,
          email: profileRes.data.email,
          password: '',
        });

        // Fetch all quizzes to map quiz IDs to titles
        const quizzesRes = await axios.get('/api/quizzes');
        setQuizzes(quizzesRes.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch profile or quizzes');
        setLoading(false);
      }
    };

    fetchProfileAndQuizzes();
  }, [auth.token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setSubmitting(true);

    try {
      const res = await axios.put('/api/profile', formData, {
        headers: {
          'x-auth-token': auth.token,
        },
      });
      setSuccessMessage(res.data.msg);

      // Update auth context with new user data
      const updatedUser = {
        ...profile,
        username: formData.username,
        email: formData.email,
      };
      setAuth({ ...auth, user: updatedUser });

      setEditMode(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2>User Profile</h2>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              New Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className="form-text">Enter a new password (minimum 6 characters).</div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditMode(false);
              setFormData({
                username: profile.username,
                email: profile.email,
                password: '',
              });
              setError('');
              setSuccessMessage('');
            }}
            disabled={submitting}
          >
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Registered On:</strong> {new Date(profile.date).toLocaleDateString()}
          </p>
          <button className="btn btn-primary" onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        </div>
      )}

      <hr />

      <h3>Quiz History</h3>
      {profile.quizAttempts.length === 0 ? (
        <p>You have not taken any quizzes yet.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Quiz Title</th>
              <th>Score</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {profile.quizAttempts
              .slice()
              .reverse()
              .map((attempt, index) => {
                const quiz = quizzes.find((q) => q._id === attempt.quizId);
                return (
                  <tr key={index}>
                    <td>{profile.quizAttempts.length - index}</td>
                    <td>{quiz ? quiz.title : 'Unknown Quiz'}</td>
                    <td>{attempt.score}</td>
                    <td>{attempt.total}</td>
                    <td>{new Date(attempt.date).toLocaleDateString()}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Profile;
