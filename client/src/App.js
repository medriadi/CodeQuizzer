import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import QuizList from './components/QuizList';
import QuizPage from './components/QuizPage';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      {/* Wrapping the entire application with AuthProvider to provide authentication context */}
      <Router>
        {/* Router component to handle navigation between different routes */}
        <Navbar /> {/* Navbar component displayed on all pages */}
        <div className="container mt-4">
          {/* Container for main content with margin on top */}
          <Routes>
            {/* Define all the routes for the application */}
            <Route path="/" element={<Home />} />
            {/* Home page route */}
            <Route path="/quizzes" element={<QuizList />} />
            {/* Quiz list page route displaying all available quizzes */}
            <Route path="/quizzes/:id" element={<QuizPage />} />
            {/* Quiz page route to display specific quiz based on ID */}
            <Route path="/login" element={<Login />} />
            {/* Login page route */}
            <Route path="/register" element={<Register />} />
            {/* Register page route */}
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  {/* Protected route to prevent unauthenticated users from accessing the leaderboard */}
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  {/* Protected route to prevent unauthenticated users from accessing the profile page */}
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
