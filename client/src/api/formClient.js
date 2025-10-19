import axios from "axios";

const formClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
    headers: { "Content-Type": "multipart/form-data" },
});

export default formClient;