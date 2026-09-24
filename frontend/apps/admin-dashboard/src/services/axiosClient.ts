// import axios, { AxiosError } from "axios";
// import { useRouter } from "next/router";

// // Create an Axios instance
// const axiosClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api", // API base URL
//   withCredentials: true, // Ensure cookies (session) are sent with requests
//   timeout: 5000, // Request timeout
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Interceptor: Request
// axiosClient.interceptors.request.use(
//   (config) => {
//     // Modify request config if needed
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle 401 Unauthorized globally
//     if (error.response?.status === 401 || error.response?.status === 403) {
//       // Clear session cookie
//       document.cookie =
//         "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

//       // Redirect using Next.js Router
//       // const router = useRouter(); // Initialize the router

//       // router.push("/signin"); // Programmatically redirect

//       if (typeof window !== "undefined") {
//         if (!window.location.href.includes("/signin")) {
//           window.location.href = "/signin";
//         }
//       }
//     }

//     // Handle specific status codes or provide a general fallback
//     const message =
//       error.response?.data?.message ||
//       error.response?.data?.error ||
//       "An unexpected error occurred.";
//     return Promise.reject({ ...error, message });
//   }
// );

// Response Interceptor: Global Error Handling
// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle 401 Unauthorized globally
//     if (error.response?.status === 401 || error.response?.status === 403) {
//       console.error("Unauthorized! Redirecting to login...");

//       // Redirect to login page and clear session cookies
//       if (typeof window !== "undefined") {
//         document.cookie =
//           "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Clear session cookie
//         window.location.href = "/signin"; // Redirect to login
//       }
//       // Optional: Redirect to login if not authenticated
//       // if (typeof window !== "undefined") {
//       //   window.location.href = "/login";
//       // }
//     }

//     // Handle specific status codes or provide a general fallback
//     const message =
//       error.response?.data?.message ||
//       error.response?.data?.error ||
//       "An unexpected error occurred.";
//     return Promise.reject({ ...error, message });
//   }
// );

// export default axiosClient;

// baseURL:
//   process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV === "development"
//     ? "http://localhost:5000/api"
//     : "https://api.example.com/api", // API base URL

import axios, { AxiosError, AxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Attach access token to each request
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401/403 errors globally and refresh token if needed
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config: any }) => {
    const originalRequest = error.config;
    const responseData: any = error.response?.data;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(axiosClient(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = Cookies.get("refreshToken");

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = data.accessToken;

        // ✅ Store new access token in cookie
        Cookies.set("accessToken", newAccessToken, {
          expires: 15,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          path: "/",
        });

        processQueue(null, newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err, null);

        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");

        if (typeof window !== "undefined") {
          const publicRoutes = [
            "/signin",
            "/register",
            "/otp",
            "/set-password",
          ];
          const currentRoute = window.location.pathname;

          if (responseData?.subscription_error) {
            if (currentRoute !== "/tenant/expired") {
              window.location.href = "/tenant/expired";
            }
          } else if (!publicRoutes.some((r) => currentRoute.includes(r))) {
            window.location.href = "/signin";
          }
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Show validation errors
    if (responseData?.errors && Array.isArray(responseData.errors)) {
      responseData.errors.forEach((err: any) =>
        toast.error(err.msg || "Validation error occurred.")
      );
    }

    // General error
    const message = responseData?.message || responseData?.error;
    if (message) toast.error(message);

    return Promise.reject({ ...error, message });
  }
);

export default axiosClient;

// process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV === "development"
//   ? "http://localhost:5000/api"
//   : "https://api.example.com/api", // API base URL
