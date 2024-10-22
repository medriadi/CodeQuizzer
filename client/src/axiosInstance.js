import axios from 'axios';

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  // Set the base URL for all requests made by this instance
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
  // Optionally, more configuration options can be added here (e.g., headers, timeouts)
});

export default axiosInstance; // Export the instance to be used throughout the application for HTTP requests
