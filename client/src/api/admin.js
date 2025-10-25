import jsonClient from "./jsonClient";

export const getPendingItems = async () => {
  response = await jsonClient.get('/admin/uploads/pending');
  return response;
}