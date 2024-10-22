import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../axiosInstance';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { auth, setAuth } = useContext(AuthContext); // Use context to get the current auth state and setAuth function
  const [profile, setProfile] = useState(null); // State to hold profile data
  const [quizzes, setQuizzes] = useState([]); // State to hold quizzes data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(''); // State to hold error messages
  const [editMode, setEditMode] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  }); // State to manage form data for editing profile
  const [successMessage, setSuccessMessage] = useState(''); // State to show success messages
  const [submitting, setSubmitting] = useState(false); // State to manage submission status
  const [activeTab, setActiveTab] = useState('profile'); // State to track the active tab (Profile Info or Quiz History)

  // Fetch user profile and quiz data on component mount
  useEffect(() => {
    const fetchProfileAndQuizzes = async () => {
      try {
        // Fetch the user profile from the backend
        const profileRes = await axiosInstance.get('/api/profile');
        setProfile(profileRes.data); // Set the profile state with the fetched data
        setFormData({
          username: profileRes.data.username, // Set the username in form data
          email: profileRes.data.email, // Set the email in form data
          password: '', // Leave password empty for security
        });

        // Fetch all quizzes from the backend
        const quizzesRes = await axiosInstance.get('/api/quizzes');
        setQuizzes(quizzesRes.data); // Set quizzes state with the fetched data

        setLoading(false); // Set loading to false after data is loaded
      } catch (err) {
        console.error(err); // Log the error to the console
        setError('Failed to fetch profile or quizzes'); // Set error message
        setLoading(false); // Set loading to false if there's an error
      }
    };

    fetchProfileAndQuizzes(); // Invoke the function to fetch data
  }, []); // Empty dependency array ensures this runs only once

  // Handle changes in form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Update the form data state based on user input
  };

  // Handle the form submission for updating user profile
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear previous error messages
    setSuccessMessage(''); // Clear previous success messages
    setSubmitting(true); // Set submitting state to true to indicate in-progress status

    try {
      // Make a PUT request to update the profile data
      const res = await axiosInstance.put('/api/profile', formData);
      setSuccessMessage(res.data.msg); // Set success message from server response

      // Update the user data in AuthContext
      const updatedUser = {
        ...profile,
        username: formData.username,
        email: formData.email,
      };
      setAuth({ ...auth, user: updatedUser }); // Update the authentication context with new user data

      setEditMode(false); // Exit edit mode after successful update
    } catch (err) {
      console.error(err); // Log any errors that occur
      setError(
        err.response?.data?.msg ||
          err.response?.data?.errors?.[0]?.msg ||
          'Failed to update profile' // Set error message based on server response or default message
      );
    } finally {
      setSubmitting(false); // Set submitting state to false after the request completes
    }
  };

  // Display loading spinner if data is still being fetched
  if (loading)
    return (
      <div className="text-center mt-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  // Display error message if there is an error
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div>
      <h2 className="text-center my-4">User Profile</h2>
      {/* Display success message if available */}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {/* Display error message if available */}
      {error && <div className="alert alert-danger">{error}</div>}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          {/* Button to show profile info tab */}
          <button
            className={`nav-link ${
              activeTab === 'profile' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Info
          </button>
        </li>
        <li className="nav-item">
          {/* Button to show quiz history tab */}
          <button
            className={`nav-link ${
              activeTab === 'history' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('history')}
          >
            Quiz History
          </button>
        </li>
      </ul>
      <div className="tab-content mt-3">
        {activeTab === 'profile' ? (
          <div>
            {editMode ? (
              <form
                onSubmit={handleSubmit}
                className="shadow-sm p-4 bg-light rounded"
              >
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
                  />
                  <div className="form-text">
                    Enter a new password (minimum 6 characters) or leave blank
                    to keep current password.
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary w-100 mt-2"
                  onClick={() => {
                    setEditMode(false); // Exit edit mode without saving changes
                    setFormData({
                      username: profile.username, // Reset username to original profile value
                      email: profile.email, // Reset email to original profile value
                      password: '', // Clear password field
                    });
                    setError(''); // Clear error messages
                    setSuccessMessage(''); // Clear success messages
                  }}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="p-4 bg-light shadow-sm rounded">
                {/* Display user profile information */}
                <p>
                  <strong>Username:</strong> {profile.username}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Registered On:</strong>{' '}
                  {new Date(profile.date).toLocaleDateString()}
                </p>
                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={() => setEditMode(true)} // Enable edit mode
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        ) : (
          // Display user's quiz history in a table
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Quiz Title</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {profile.quizAttempts.slice().reverse().map((attempt, index) => {
                const quiz = quizzes.find((q) => q._id === attempt.quizId); // Find the quiz data for the given attempt
                const percentage = (
                  (attempt.score / attempt.total) *
                  100
                ).toFixed(2); // Calculate percentage score to two decimal places
                return (
                  <tr key={index}>
                    <td>{profile.quizAttempts.length - index}</td> {/* Display attempt number */}
                    <td>{quiz ? quiz.title : 'Unknown Quiz'}</td> {/* Display quiz title or fallback text */}
                    <td>
                      {attempt.score} / {attempt.total} ({percentage}%) {/* Display score and percentage */}
                    </td>
                    <td>{new Date(attempt.date).toLocaleDateString()}</td> {/* Display date of quiz attempt */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Profile;
