import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { setAuthToken } from '../axiosInstance';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { setAuth } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await axiosInstance.post('/api/auth/register', form);
      localStorage.setItem('token', response.data.token);
      setAuth((previous) => ({
        ...previous,
        token: response.data.token,
        isAuthenticated: true,
        loading: false,
      }));
      setAuthToken(response.data.token);
      const userResponse = await axiosInstance.get('/api/auth/user');
      setAuth((previous) => ({ ...previous, user: userResponse.data }));
      navigate('/');
    } catch (requestError) {
      setError(requestError.response?.data?.msg || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm p-4">
          <h2 className="text-center mb-4">Create your account</h2>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input id="username" name="username" className="form-control" value={form.username} onChange={handleChange} minLength="3" maxLength="30" required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input id="email" name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input id="password" name="password" type="password" className="form-control" value={form.password} onChange={handleChange} minLength="6" required />
              <div className="form-text">Password must be at least 6 characters long.</div>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
