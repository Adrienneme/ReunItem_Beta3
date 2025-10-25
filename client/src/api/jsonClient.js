import axios from "axios";

const jsonClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000" || "http://127.0.0.1:8000", //FastAPI backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

jsonClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

jsonClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401){
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error)
  }
)

export default jsonClient;