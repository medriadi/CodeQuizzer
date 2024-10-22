import React, { useState, useContext } from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { setAuth } = useContext(AuthContext); // Use AuthContext to update authentication state after successful registration
  const [username, setUsername] = useState(''); // State for storing the user's entered username
  const [email, setEmail] = useState(''); // State for storing the user's entered email
  const [password, setPassword] = useState(''); // State for storing the user's entered password
  const [error, setError] = useState(''); // State for storing any error messages from registration process
  const [submitting, setSubmitting] = useState(false); // State for managing the submission/loading status
  const navigate = useNavigate(); // Hook for navigation between routes

  // Handle form submission for registration
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setSubmitting(true); // Set submitting state to true to indicate form is being submitted
    setError(''); // Clear previous error messages
    try {
      // Make POST request to register endpoint with user's entered data
      const res = await axiosInstance.post('/api/auth/register', { username, email, password });
      // Store the received token in localStorage
      localStorage.setItem('token', res.data.token);
      // Update AuthContext with new authentication state after successful registration
      setAuth((prevState) => ({
        ...prevState,
        token: res.data.token, // Set token from response
        isAuthenticated: true, // Set authentication status to true
        loading: false, // Loading is complete
      }));
      // Set the default Authorization header for future axios requests
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      // Navigate to the home page after successful registration
      navigate('/');
    } catch (err) {
      // Set error message if registration fails
      setError(err.response?.data?.msg || 'Registration failed');
    } finally {
      setSubmitting(false); // Set submitting state to false after request completes
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm p-4">
          <h2 className="text-center mb-4">Register</h2>
          {/* Display error message if there is one */}
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Update username state when user types
                required
              />
              <div className="invalid-feedback">
                Please enter a username. {/* Display message when username is invalid */}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state when user types
                required
              />
              <div className="invalid-feedback">
                Please enter a valid email. {/* Display message when email is invalid */}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state when user types
                required
              />
              <div className="form-text">
                Password must be at least 6 characters long. {/* Inform user about password requirements */}
              </div>
            </div>
            {/* Submit button to register */}
            <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
              {/* Show spinner while submitting, otherwise show 'Register' */}
              {submitting ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
