import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance, { requestMessage } from "../axiosInstance";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { startSession } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [state, setState] = useState({ error: "", submitting: false });
  const navigate = useNavigate();
  const location = useLocation();
  const submit = async (event) => {
    event.preventDefault();
    setState({ error: "", submitting: true });
    try {
      const { data } = await axiosInstance.post("/api/auth/register", form);
      startSession(data.token);
      navigate(location.state?.from || "/quizzes", { replace: true });
    } catch (error) {
      setState({
        error: requestMessage(error, "Unable to create account."),
        submitting: false,
      });
    }
  };
  const update = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  return (
    <section className="auth-layout">
      <div className="auth-aside auth-aside-accent">
        <p className="eyebrow">START HERE</p>
        <h1>Build confidence with every answer.</h1>
        <p>
          Create your free account and turn small daily practice into real
          momentum.
        </p>
      </div>
      <div className="auth-card">
        <p className="eyebrow">NEW ACCOUNT</p>
        <h2>Create account</h2>
        <p className="muted">It only takes a minute to get started.</p>
        {state.error && (
          <div className="alert alert-error" role="alert">
            {state.error}
          </div>
        )}
        <form onSubmit={submit}>
          <label>
            Username
            <input
              name="username"
              autoComplete="username"
              pattern="[a-zA-Z0-9]+"
              title="Use letters and numbers only"
              value={form.username}
              onChange={update}
              minLength="3"
              maxLength="30"
              required
            />
          </label>
          <label>
            Email address
            <input
              name="email"
              autoComplete="email"
              type="email"
              value={form.email}
              onChange={update}
              required
            />
          </label>
          <label>
            Password
            <input
              name="password"
              autoComplete="new-password"
              type="password"
              value={form.password}
              onChange={update}
              minLength="6"
              required
            />
            <small>Use at least 6 characters.</small>
          </label>
          <button
            className="button button-primary button-full"
            disabled={state.submitting}
          >
            {state.submitting ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="form-footer">
          Already have an account?{" "}
          <Link to="/login" state={location.state}>
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
