import axios from "axios";

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

    // If access token expired
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // ✅ FIXED LINE (IMPORTANT)
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return API(originalRequest);

      } catch (err) {
        // Refresh token expired → logout
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);