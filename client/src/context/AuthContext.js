import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
  });

  useEffect(() => {
    const loadUser = async () => {
      if (auth.token) {
        try {
          const res = await axios.get('/api/auth/user', {
            headers: { 'x-auth-token': auth.token },
          });
          setAuth({
            ...auth,
            isAuthenticated: true,
            loading: false,
            user: res.data,
          });
        } catch (err) {
          console.error(err);
          setAuth({
            token: null,
            isAuthenticated: false,
            loading: false,
            user: null,
          });
        }
      } else {
        setAuth({
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null,
        });
      }
    };

    loadUser();
  }, [auth]);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setAuth({
        ...auth,
        token: res.data.token,
        isAuthenticated: true,
        loading: false,
      });
      // Load user data
      const userRes = await axios.get('/api/auth/user', {
        headers: { 'x-auth-token': res.data.token },
      });
      setAuth({
        ...auth,
        token: res.data.token,
        isAuthenticated: true,
        loading: false,
        user: userRes.data,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
