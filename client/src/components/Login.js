import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [state, setState] = useState({ error: "", submitting: false });
  const navigate = useNavigate();
  const location = useLocation();
  const submit = async (event) => {
    event.preventDefault();
    setState({ error: "", submitting: true });
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || "/quizzes", { replace: true });
    } catch (error) {
      setState({
        error: error.response?.data?.msg || "Unable to sign in.",
        submitting: false,
      });
    }
  };
  return (
    <section className="auth-layout">
      <div className="auth-aside">
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Your next breakthrough is one quiz away.</h1>
        <p>
          Sign in to pick up where you left off and keep your learning moving.
        </p>
      </div>
      <div className="auth-card">
        <p className="eyebrow">ACCOUNT</p>
        <h2>Sign in</h2>
        <p className="muted">Welcome back. Enter your details below.</p>
        {state.error && (
          <div className="alert alert-error" role="alert">
            {state.error}
          </div>
        )}
        <form onSubmit={submit}>
          <label>
            Email address
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              minLength="6"
              required
            />
          </label>
          <button
            className="button button-primary button-full"
            disabled={state.submitting}
          >
            {state.submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="form-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
