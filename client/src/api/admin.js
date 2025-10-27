import jsonClient from "./jsonClient";

export const getPendingItems = async () => {
  const response = await jsonClient.get('/admin/uploads/pending', {
    headers: {
      role: 'admin',  
    },
  });
  return response.data;
};

// test for approve function

export const approveEntry = async (entryId) => {
  const response = await jsonClient.post(
    `/admin/approve_entry/${entryId}`,
    {}, 
    {
      headers: {
        role: 'admin', 
      },
    }
  );
  return response.data;
};