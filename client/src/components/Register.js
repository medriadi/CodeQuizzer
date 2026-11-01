import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance, { setAuthToken } from '../axiosInstance';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { setAuth } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [state, setState] = useState({ error: '', submitting: false });
  const navigate = useNavigate();
  const submit = async (event) => {
    event.preventDefault();
    setState({ error: '', submitting: true });
    try {
      const { data } = await axiosInstance.post('/api/auth/register', form);
      localStorage.setItem('token', data.token);
      setAuthToken(data.token);
      const user = await axiosInstance.get('/api/auth/user');
      setAuth({ token: data.token, isAuthenticated: true, loading: false, user: user.data });
      navigate('/quizzes');
    } catch (error) {
      setState({ error: error.response?.data?.msg || error.response?.data?.errors?.[0]?.msg || 'Unable to create account.', submitting: false });
    }
  };
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  return <section className="auth-layout"><div className="auth-aside auth-aside-accent"><p className="eyebrow">START HERE</p><h1>Build confidence with every answer.</h1><p>Create your free account and turn small daily practice into real momentum.</p></div><div className="auth-card"><p className="eyebrow">NEW ACCOUNT</p><h2>Create account</h2><p className="muted">It only takes a minute to get started.</p>{state.error && <div className="alert alert-error">{state.error}</div>}<form onSubmit={submit}><label>Username<input name="username" value={form.username} onChange={update} minLength="3" maxLength="30" required /></label><label>Email address<input name="email" type="email" value={form.email} onChange={update} required /></label><label>Password<input name="password" type="password" value={form.password} onChange={update} minLength="6" required /><small>Use at least 6 characters.</small></label><button className="button button-primary button-full" disabled={state.submitting}>{state.submitting ? 'Creating account...' : 'Create account'}</button></form><p className="form-footer">Already have an account? <Link to="/login">Sign in</Link></p></div></section>;
};

export default Register;
