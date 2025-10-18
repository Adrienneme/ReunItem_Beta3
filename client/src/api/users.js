import apiClient from "./client";

export const registerUser = async (data) => {
  const response = await apiClient.post("/users/register", data);
  return response.data;
}

export const loginUser = async (data) => {
  const response = await apiClient.post("/users/login", data);
  return response.data
}

export const get_current_user = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("NO token Found");

  const response = await apiClient.get("user/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data
}