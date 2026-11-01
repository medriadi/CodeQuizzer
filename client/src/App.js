import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import QuizList from "./components/QuizList";
import QuizPage from "./components/QuizPage";
import Leaderboard from "./components/Leaderboard";
import Profile from "./components/Profile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="app-shell">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route
              path="/quizzes/:id"
              element={
                <ProtectedRoute>
                  <QuizPage />
                </ProtectedRoute>
              }
            />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
