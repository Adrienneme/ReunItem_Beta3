import axios from "axios";

const formClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000" || "http://127.0.0.1:8000",
});

// Automatically add the JWT to the Authorization header of every request.
formClient.interceptors.request.use(config => {
  //Retrieve the token from the browser's persistent storage.
  const token = localStorage.getItem("token"); 

  //Check if a token was found.
  if (token) {
    //If a token exists, attach it to the request headers.
    config.headers.Authorization = `Bearer ${token}`;
  }

  //Return the configuration to continue the request.
  return config;
});

export default formClient;
