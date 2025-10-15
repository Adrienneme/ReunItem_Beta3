import apiClient from "./client";

export const registerUser = async (data) => {
  const response = await apiClient.post("/users/register", data);
  return response.data;
}
export const loginUser = async (data) => {
  const response = await apiClient.post("/users/login", data);
  return response.data
}