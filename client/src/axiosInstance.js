import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:5000",
  // Render's free service can take over 50 seconds to wake after inactivity.
  timeout: 75000,
});

export const setAuthToken = (token) => {
  if (token)
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common.Authorization;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = axiosInstance.defaults.headers.common.Authorization;
    if (
      error.response?.status === 401 &&
      token &&
      error.config?.headers?.Authorization === token &&
      !error.config?.url?.includes("/api/auth/login")
    ) {
      window.dispatchEvent(new Event("codequizzer:unauthorized"));
    }
    return Promise.reject(error);
  },
);

export const requestMessage = (error, fallback) => {
  if (error.response?.data?.msg) return error.response.data.msg;
  if (error.response?.data?.errors?.[0]?.msg)
    return error.response.data.errors[0].msg;
  if (error.code === "ECONNABORTED" || !error.response)
    return "The server is taking longer than expected. Please check your connection and try again.";
  return fallback;
};
export default axiosInstance;
