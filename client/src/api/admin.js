import jsonClient from "./jsonClient";

export const getPendingItems = async () => {
  const response = await jsonClient.get('/admin/uploads/pending', {
    headers: {
      role: 'admin',  
    },
  });
  return response.data;
};
