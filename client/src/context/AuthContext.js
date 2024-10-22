import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

// Create the authentication context to be shared across components
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // Retrieve the initial token from localStorage, if it exists
  const initialToken = localStorage.getItem('token');
  const [auth, setAuth] = useState({
    token: initialToken, // Initialize the token state with the value from localStorage
    isAuthenticated: null, // Indicates if the user is authenticated or not
    loading: true, // Loading state to manage user authentication status during app initialization
    user: null, // Stores the user information once authenticated
  });

  useEffect(() => {
    // Helper function to set the authorization token in axios headers
    const setAxiosAuthToken = (token) => {
      if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set the Authorization header if token exists
      } else {
        delete axiosInstance.defaults.headers.common['Authorization']; // Remove the Authorization header if no token
      }
    };

    // Function to load user data if a valid token is present
    const loadUser = async () => {
      if (auth.token) {
        setAxiosAuthToken(auth.token); // Set token in axios headers for future requests
        try {
          const res = await axiosInstance.get('/api/auth/user'); // Fetch the authenticated user's data
          setAuth((prevState) => ({
            ...prevState,
            isAuthenticated: true, // Set user as authenticated
            loading: false, // Loading complete
            user: res.data, // Store user data in state
          }));
        } catch (err) {
          console.error(err); // Log any errors that occur during the user loading process
          localStorage.removeItem('token'); // Remove invalid token from localStorage
          setAxiosAuthToken(null); // Remove token from axios headers
          setAuth({
            token: null, // Clear token
            isAuthenticated: false, // Set authentication status to false
            loading: false, // Loading complete
            user: null, // Clear user data
          });
        }
      } else {
        // If no token exists, set default authentication state
        setAuth({
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null,
        });
      }
    };

    loadUser(); // Load user on component mount or when the token changes
  }, [auth.token]);

  // Login function to authenticate the user
  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post('/api/auth/login', { email, password }); // Attempt to login with provided credentials
      localStorage.setItem('token', res.data.token); // Store the received token in localStorage
      setAuth((prevState) => ({
        ...prevState,
        token: res.data.token, // Update token state with new token
        isAuthenticated: true, // Set authentication status to true
        loading: false, // Loading complete
      }));
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`; // Set token in axios headers
      // Load user data after successful login
      const userRes = await axiosInstance.get('/api/auth/user');
      setAuth((prevState) => ({
        ...prevState,
        user: userRes.data, // Store user data in state
      }));
    } catch (err) {
      console.error(err); // Log any errors during the login process
      throw err; // Re-throw error to be handled by the caller
    }
  };

  // Logout function to clear user session
  const logout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    delete axiosInstance.defaults.headers.common['Authorization']; // Remove token from axios headers
    setAuth({
      token: null, // Clear token state
      isAuthenticated: false, // Set authentication status to false
      loading: false, // Loading complete
      user: null, // Clear user data
    });
  };

  return (
    // Provide the authentication state and functions to the entire application
    <AuthContext.Provider value={{ auth, login, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
