import axios from "axios";

const userClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000" || "http://127.0.0.1:8000", 
  headers: {
    "Content-Type": "application/json",
  },
});

userClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
)

export default userClient;