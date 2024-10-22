import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import { AuthContext } from '../context/AuthContext'; // Import the authentication context

const Login = () => {
  // State variables to manage email, password, error messages, and submission state
  const [email, setEmail] = useState(''); // State to store the user's email
  const [password, setPassword] = useState(''); // State to store the user's password
  const [error, setError] = useState(''); // State to store any login errors
  const [submitting, setSubmitting] = useState(false); // State to manage the submission status

  const navigate = useNavigate(); // Hook for navigating between routes
  const { login } = useContext(AuthContext); // Get the login function from AuthContext to authenticate the user

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setSubmitting(true); // Set submitting state to true to indicate the login process has started
    try {
      await login(email, password); // Attempt to log in with the provided email and password
      navigate('/'); // Redirect to the home page on successful login
    } catch (err) {
      // If an error occurs, set the error state with the appropriate message
      setError(err.response?.data?.msg || 'Login failed'); // Display error message from server or a default message
    } finally {
      setSubmitting(false); // Set submitting state to false after login attempt (success or failure)
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm p-4">
          <h2 className="text-center mb-4">Login</h2>
          {/* Display an error alert if there is an error */}
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state on input change
                required
              />
              <div className="invalid-feedback">
                Please enter a valid email. {/* Message shown if email validation fails */}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state on input change
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
              {submitting ? (
                // Show a spinner if the form is being submitted
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                'Login' // Show 'Login' text if not submitting
              )}
            </button>
          </form>
          <div className="mt-3 text-center">
            <span>Don't have an account? </span>
            {/* Button to navigate to the register page */}
            <button
              type="button"
              className="btn btn-secondary w-100 mt-2"
              onClick={() => navigate('/register')} // Navigate to the register page when clicked
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
