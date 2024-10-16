import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const initialToken = localStorage.getItem('token');
  const [auth, setAuth] = useState({
    token: initialToken,
    isAuthenticated: null,
    loading: true,
    user: null,
  });

  useEffect(() => {
    const setAxiosAuthToken = (token) => {
      if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
      }
    };

    const loadUser = async () => {
      if (auth.token) {
        setAxiosAuthToken(auth.token);
        try {
          const res = await axiosInstance.get('/api/auth/user');
          setAuth((prevState) => ({
            ...prevState,
            isAuthenticated: true,
            loading: false,
            user: res.data,
          }));
        } catch (err) {
          console.error(err);
          localStorage.removeItem('token');
          setAxiosAuthToken(null);
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
  }, [auth.token]);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setAuth((prevState) => ({
        ...prevState,
        token: res.data.token,
        isAuthenticated: true,
        loading: false,
      }));
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      // Load user data
      const userRes = await axiosInstance.get('/api/auth/user');
      setAuth((prevState) => ({
        ...prevState,
        user: userRes.data,
      }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
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
