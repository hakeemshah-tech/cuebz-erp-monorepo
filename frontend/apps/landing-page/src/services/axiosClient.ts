import axios from "axios";

// Create an Axios instance
const axiosClient = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://api.example.com/api"
      : "http://localhost:5000/api", // API base URL
  timeout: 5000, // Request timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Request
axiosClient.interceptors.request.use(
  (config) => {
    // Modify request config if needed
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific status codes or provide a general fallback
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "An unexpected error occurred.";
    return Promise.reject({ ...error, message });
  }
);

// Response Interceptor: Global Error Handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific status codes or provide a general fallback
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "An unexpected error occurred.";
    return Promise.reject({ ...error, message });
  }
);

export default axiosClient;
