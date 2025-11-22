import axios from "axios";

const jsonClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000" || "http://127.0.0.1:8000", 
  headers: {
    "Content-Type": "application/json",
  },
});

jsonClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
)

jsonClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      console.warn("Session expired. Redirecting to login...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (!window.alertShown) {
        window.alertShown = true;
        alert("Your session has expired. Please log in again.");
        setTimeout(() => {
          window.alertShown = false;
          window.location.assign("/login");
        }, 200);
      }
    }
  }
)

export default jsonClient;