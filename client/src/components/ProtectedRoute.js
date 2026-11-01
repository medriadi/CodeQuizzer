import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { auth } = useContext(AuthContext);
  const location = useLocation();
  if (auth.loading)
    return (
      <div className="center-state" role="status">
        <span className="loader" />
        Checking your session…
      </div>
    );
  return auth.isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
}
