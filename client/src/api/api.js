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

    // If request fails with 401
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {

      originalRequest._retry = true;

      try {

        const refreshToken = localStorage.getItem("refreshToken");

        // If no refresh token → do not logout automatically
        if (!refreshToken) {
          return Promise.reject(error);
        }

        // Request new access token
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        // Save new token
        localStorage.setItem("accessToken", newAccessToken);

        // Update header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry original request
        return API(originalRequest);

      } catch (refreshError) {

        console.log("Refresh token failed");

        // Do NOT clear localStorage here
        return Promise.reject(refreshError);

      }

    }

    return Promise.reject(error);

  }

);