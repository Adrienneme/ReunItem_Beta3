import jsonClient from "../api/axios/jsonClient";
import userClient from "../api/axios/userClient";

export const registerUser = async (data) => {
  console.log(data)
  const response = await jsonClient.post("/users/register", data);
  return response.data;
};


export const loginUser = async (data) => {
  const response = await userClient.post("/users/login", data);
  const token = response.data.access_token;
  if (token) {
    localStorage.setItem("token", token);
  }
  return response.data;
};


export const logoutUser = async () => {
  const response = await userClient.post("/users/logout");
  return response.data;
};


export const getCurrentUser = async () => {
  const response = await userClient.get("/users/me");
  return response.data;
};


export const adminCreateUser = async (data) => {
  const response = await userClient.post("/users/admin-create", data);
  return response.data;
};


export const getAllUsers = async () => {
  const response = await userClient.get("/users/get-all-user");
  return response.data;
};


export const getUser = async (user_id) => {
  const response = await userClient.get(`/users/get-user/${user_id}`);
  return response.data;
};


export const updateUser = async (user_id, updates) => {
  const response = await userClient.put(`/users/update/${user_id}`, updates);
  return response.data;
};


export const deleteUser = async (user_id) => {
  const response = await userClient.delete(`/users/delete/${user_id}`);
  return response.data;
};
