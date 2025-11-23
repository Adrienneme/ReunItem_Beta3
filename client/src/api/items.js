import formClient from "../api/axios/formClient";
import jsonClient from "../api/axios/jsonClient"

export const createItem = async (formData) => {
  const allData = new FormData();
  allData.append("item_name", formData.item_name);
  allData.append("description", formData.description);
  allData.append("pickup_location", formData.pickup_location);
  allData.append("contact_number", formData.contact_number);
  const typeValue = formData.item_type === "lost" ? "lost" : "found";
  allData.append("type", typeValue);
  allData.append("status", formData.status || "Pending Approval");

  if (formData.photo) allData.append("photo", formData.photo);

  const response = await formClient.post("/items/create", allData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};


export const generateDescription = async (photo) => {
  if (!photo) throw new Error("No photo provided to generateDescription");

  const photoFile = new FormData();
  photoFile.append("photo", photo);

  try {
    const response = await formClient.post("/items/generate", photoFile);
    console.log("Backend response inside generateDescription:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error in generateDescription:", err);
    throw err; 
  }
};


export const updateItem = async (entry_id, data) => {
  const formData = new FormData();
  if (data.item_name) formData.append("item_name", data.item_name);
  if (data.description) formData.append("description", data.description);
  if (data.pickup_location) formData.append("pickup_location", data.pickup_location);
  if (data.contact_number) formData.append("pickup_location", data.contact_number);
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

export const getMatches = async (entryId) => {
  const response = await jsonClient.post(`/items/matches/${entryId}`);
  console.log("Matches response data:", response.data);
  return response.data;
}

export const setMatch = async (lostentryId, foundentryId, similarity) => {
  const response = await jsonClient.post("/items/set_match", {
    lost_entry_id: lostentryId,
    found_entry_id: foundentryId,
    similarity: similarity
  })
  return response.data;
}

export const getMatch = async (entryId) => {
  const response = await jsonClient.get(`items/get_match/${entryId}`);
  return response.data;
}

export const delClaim = async (entryId) => {
  const response = await jsonClient.delete(`items/cancel_claim/${entryId}`);
  return response.data;
}