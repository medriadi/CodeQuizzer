import React, { useState, useContext } from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { setAuth } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await axiosInstance.post('/api/auth/register', { username, email, password });
      localStorage.setItem('token', res.data.token);
      setAuth((prevState) => ({
        ...prevState,
        token: res.data.token,
        isAuthenticated: true,
        loading: false,
      }));
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm p-4">
          <h2 className="text-center mb-4">Register</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <div className="invalid-feedback">
                Please enter a username.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="invalid-feedback">
                Please enter a valid email.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="form-text">Password must be at least 6 characters long.</div>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
              {submitting ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
