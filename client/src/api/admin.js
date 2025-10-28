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

//Fetch Claim
export const admin_claims_pending = async () => {
  const response = await jsonClient.get('/admin/claims/pending', {
    headers: {
      role: 'admin',  
    },
  });
  return response.data;
    }

// Approve claim request
export const approveClaim = async (entry_id) => {
  const token = localStorage.getItem("token"); // adjust if you use a different storage key
  const response = await jsonClient.post(
    `/admin/approve_claim/${entry_id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
// Reject claim request
export const rejectClaim = async (entry_id) => {
  const token = localStorage.getItem("token");
  const response = await jsonClient.post(
    `/admin/reject_claim/${entry_id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};