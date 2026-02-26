// import axios from "axios";

// export const API = axios.create({
//   baseURL: "http://localhost:5000/api",
// });
// //"https://careerconnect-backend-tchr.onrender.com/api"

// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   console.log("TOKEN:", token);   // 👈 ADD THIS

//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }

//   return req;
// });
import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});