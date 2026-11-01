import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [state, setState] = useState({ loading: true, saving: false, error: '', success: '' });

  useEffect(() => {
    axiosInstance.get('/api/profile').then(({ data }) => {
      setProfile(data);
      setForm({ username: data.username, email: data.email, password: '' });
    }).catch(() => setState((previous) => ({ ...previous, error: 'Unable to load your profile.' }))).finally(() => setState((previous) => ({ ...previous, loading: false })));
  }, []);

  const save = async (event) => {
    event.preventDefault();
    setState((previous) => ({ ...previous, saving: true, error: '', success: '' }));
    try {
      const { data } = await axiosInstance.put('/api/profile', form);
      setProfile((previous) => ({ ...previous, ...data.user }));
      setEditing(false);
      setState((previous) => ({ ...previous, saving: false, success: 'Profile updated successfully.' }));
    } catch (error) {
      setState((previous) => ({ ...previous, saving: false, error: error.response?.data?.msg || 'Unable to update your profile.' }));
    }
  };

  if (state.loading) return <div className="center-state"><span className="loader" /> Loading profile...</div>;
  if (!profile) return <div className="page-narrow"><div className="alert alert-error">{state.error}</div></div>;
  return <section className="page-section page-narrow"><div className="section-heading"><div><p className="eyebrow">YOUR SPACE</p><h1>Profile</h1></div><p>Keep your details current and review your learning history.</p></div>{state.error && <div className="alert alert-error">{state.error}</div>}{state.success && <div className="alert" style={{ background: '#eef8f0', color: '#2f7d55' }}>{state.success}</div>}<div className="profile-layout"><div className="profile-card"><div className="avatar">{profile.username[0].toUpperCase()}</div><h2>{profile.username}</h2><p className="muted">{profile.email}</p><button className="button button-small" onClick={() => setEditing((value) => !value)}>{editing ? 'Cancel' : 'Edit profile'}</button>{editing && <form className="profile-form" onSubmit={save}><label>Username<input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></label><label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label><label>New password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength="6" /><small>Leave blank to keep your current password.</small></label><button className="button button-primary button-full" disabled={state.saving}>{state.saving ? 'Saving...' : 'Save changes'}</button></form>}</div><div className="history-card"><p className="eyebrow">RECENT ACTIVITY</p><h2>Quiz history</h2>{profile.quizAttempts?.length ? profile.quizAttempts.slice().reverse().map((attempt) => <div className="history-row" key={attempt._id}><div><strong>{attempt.quizId?.title || 'Completed quiz'}</strong><small>{new Date(attempt.date).toLocaleDateString()}</small></div><span>{attempt.score} / {attempt.total}<small>{attempt.total ? Math.round((attempt.score / attempt.total) * 100) : 0}%</small></span></div>) : <p className="muted">Complete your first quiz to see your progress here.</p>}</div></div></section>;
};

export default Profile;
