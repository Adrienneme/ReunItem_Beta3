import jsonClient from "../api/axios/jsonClient";
import userClient from "../api/axios/userClient";
import { logoutClient } from "./axios/logoutClient";

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


export const logoutUser = async (user_id) => {
  const response = await logoutClient.post(`/users/logout/${user_id}`);
  return response.data;
};


export const getCurrentUser = async () => {
  const response = await jsonClient.get("/users/me");
  return response.data;
};



//ADMIN CRUD 

//add user
export const adminCreateUser = async (data) => {
  const response = await jsonClient.post("/users/admin-create", data);
  return response.data;
};

//fetching all users
export const getAllUsers = async () => {
  const response = await jsonClient.get("/users/get-all-user");
  return response.data;
};

//fetch specific  user
export const getUser = async (user_id) => {
  const response = await jsonClient.get(`/users/get-user/${user_id}`);
  return response.data;
};

//update specific user
export const updateUser = async (user_id, updates) => {
  const response = await jsonClient.put(`/users/update/${user_id}`, updates);
  return response.data;
};

//delete specific user
export const deleteUser = async (user_id) => {
  const response = await jsonClient.delete(`/users/delete/${user_id}`);
  return response.data;
};
