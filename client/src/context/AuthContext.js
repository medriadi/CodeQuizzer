import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import axiosInstance, { setAuthToken } from '../axiosInstance';

export const AuthContext = createContext(null);

const unauthenticatedState = {
  token: null,
  isAuthenticated: false,
  loading: false,
  user: null,
};

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    return {
      token,
      isAuthenticated: null,
      loading: Boolean(token),
      user: null,
    };
  });

  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setAuth(unauthenticatedState);
  }, []);

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      if (!auth.token) {
        setAuth(unauthenticatedState);
        return;
      }

      setAuthToken(auth.token);
      try {
        const response = await axiosInstance.get('/api/auth/user');
        if (active) {
          setAuth((previous) => ({
            ...previous,
            isAuthenticated: true,
            loading: false,
            user: response.data,
          }));
        }
      } catch (error) {
        if (active) {
          clearSession();
        }
      }
    };

    loadUser();
    return () => {
      active = false;
    };
  }, [auth.token, clearSession]);

  const login = useCallback(async (email, password) => {
    const response = await axiosInstance.post('/api/auth/login', { email, password });
    const token = response.data.token;
    localStorage.setItem('token', token);
    setAuthToken(token);
    setAuth((previous) => ({
      ...previous,
      token,
      isAuthenticated: true,
      loading: false,
    }));

    const userResponse = await axiosInstance.get('/api/auth/user');
    setAuth((previous) => ({ ...previous, user: userResponse.data }));
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({ auth, login, logout, setAuth }),
    [auth, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
