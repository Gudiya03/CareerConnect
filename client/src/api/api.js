import axios from "axios";

// Create axios instance
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


// ================= REQUEST INTERCEPTOR =================
API.interceptors.request.use((req) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    req.headers.Authorization = `Bearer ${accessToken}`;
  }

  return req;
});


// ================= RESPONSE INTERCEPTOR =================
API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {

      originalRequest._retry = true;

      try {

        const refreshToken = localStorage.getItem("refreshToken");

        // If refresh token missing → logout
        if (!refreshToken) {
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Request new access token
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        // Save new access token
        localStorage.setItem("accessToken", newAccessToken);

        // Update header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry original request
        return API(originalRequest);

      } catch (refreshError) {

        // Refresh token expired → logout user
        localStorage.clear();
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);