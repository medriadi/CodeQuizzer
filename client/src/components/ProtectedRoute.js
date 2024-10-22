import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  // Get the current authentication state from AuthContext
  const { auth } = useContext(AuthContext);

  // If authentication state is still loading, display a loading spinner
  if (auth.loading) {
    return (
      <div className="text-center mt-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If the user is authenticated, render the children components, otherwise redirect to the login page
  return auth.isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
