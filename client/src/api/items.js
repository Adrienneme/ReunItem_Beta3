import formClient from "./formClient";
import jsonClient from "./jsonClient"

export const createItem = async (formData) => {
  const allData = new FormData();
  allData.append("item_name", formData.item_name);
  allData.append("description", formData.description);
  allData.append("pickup_location", formData.pickup_location);
  const typeValue = formData.item_type === "lost" ? "lost" : "found";
  allData.append("type", typeValue);
  allData.append("status", formData.status || "Pending Approval");

  if (formData.photo) allData.append("photo", formData.photo);

  const response = await formClient.post("/items/report", allData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const generateDescription = async (photoFile) => {
  const photo = photoFile.photo;
   if (photo) allData.append("photo", photo);

  const response = await formClient.post("/items/report", photo, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const updateItem = async (entry_id, data) => {
  const formData = new FormData();
  if (data.item_name) formData.append("item_name", data.item_name);
  if (data.description) formData.append("description", data.description);
  if (data.pickup_location) formData.append("pickup_location", data.pickup_location);
  if (data.type) formData.append("type", data.type);
  if (data.photo) formData.append("photo", data.photo);

  const response = await formClient.put(`/items/edit/${entry_id}`, formData);
  return response.data;
};


export const getItems = async () => {
  const response = await jsonClient.get("/items/list");
  return response.data;
};


export const getItem = async (entryId) => {
  const response = await jsonClient.get(`/items/detail/${entryId}`);
  return response.data;
};


export const deleteItem = async (entryId) => {
  const response = await jsonClient.delete(`/items/delete/${entryId}`);
  return response.data;
};