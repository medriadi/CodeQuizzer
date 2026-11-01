import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
  timeout: 10000,
});

export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = 'Bearer ' + token;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

setAuthToken(localStorage.getItem('token'));

export default axiosInstance;
