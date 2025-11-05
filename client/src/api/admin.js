import jsonClient from "./jsonClient";

//========= Pending Submissions =======
export const getPendingItems = async (filter = "All") => {
  const response = await jsonClient.get('/admin/uploads/pending', {
    params: { item_type: filter }, 
    headers: {
      role: 'admin',
    },
  });
  return response.data;
};

// test for approve function from image_accept.py

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
};//  Fetch all pending matches
export const getAllMatches = async () => {
  try {
    const response = await jsonClient.get("/admin/matches");
    return response.data.matches;
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
};

//  Approve claim request
export const approveClaim = async (match_id) => {
  try {
    const response = await jsonClient.post(`/admin/approve_claim/${match_id}`);
    return response.data;
  } catch (error) {
    console.error("Error approving claim:", error);
    throw error;
  }
};

//  Reject claim request
export const rejectClaim = async (match_id) => {
  try {
    const response = await jsonClient.post(`/admin/reject_claim/${match_id}`);
    return response.data;
  } catch (error) {
    console.error("Error rejecting claim:", error);
    throw error;
  }
};

////////

//========Lost/Found Entries ======
//Fetch Approved and Match
export const admin_items = async () => {
  try {
    const { data } = await jsonClient.get('/admin/items', {
      headers: { role: 'admin' },
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch admin items:", error);
    throw error;
  }
};

////Archived
export const archived_items = async () => {
  try {
    const { data } = await jsonClient.get('/admin/archived_items', {
      headers: { role: 'admin' },
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch admin items:", error);
    throw error;
  }
};
