import axios from "axios";

const jsonClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000" || "http://127.0.0.1:8000", //FastAPI backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default jsonClient;