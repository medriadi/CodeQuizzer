import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoadingState from "./LoadingState";
export default function ProtectedRoute({ children }) {
  const { auth, retrySession, logout } = useContext(AuthContext);
  const location = useLocation();
  if (auth.loading) return <LoadingState>Checking your session…</LoadingState>;
  if (auth.token && auth.error)
    return (
      <div className="center-state">
        <h1>Let’s reconnect.</h1>
        <p role="alert">{auth.error}</p>
        <button className="button button-primary" onClick={retrySession}>
          Try again
        </button>
        <button className="button button-ghost" onClick={logout}>
          Sign out
        </button>
      </div>
    );
  return auth.isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
}
