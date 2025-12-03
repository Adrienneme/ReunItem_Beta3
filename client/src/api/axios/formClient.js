import axios from "axios";
import { logoutUser } from "../users";

const formClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000" || "http://127.0.0.1:8000",
});

formClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

formClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.alertShown) {
        window.alertShown = true;
        alert("Your session has expired. Please log in again.");

        const res = JSON.parse(localStorage.getItem("user"));
        const user_id = res?.user_id
        logoutUser(user_id);

        setTimeout(() => {
          window.alertShown = false;
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.assign("/login");
        }, 200);
      }
    }
    return Promise.reject(error);
  }
);

export default formClient;
