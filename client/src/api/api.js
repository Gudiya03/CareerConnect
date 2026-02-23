import axios from "axios";

export const API = axios.create({
  baseURL: "https://careerconnect-backend-tchr.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  console.log("TOKEN:", token);   // 👈 ADD THIS

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});