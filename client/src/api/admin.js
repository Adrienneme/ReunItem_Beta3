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
};

////////// ========Claim Request ==========
///View All Entries
// View All Entries
export const getAllMatches = async () => {
  const response = await jsonClient.get('/admin/matches', {
    headers: { role: 'admin' },
  });
  return response.data.matches;
};

// Approve claim request from admin/routes.py
export const approveClaim = async (match_id) => {
  const token = localStorage.getItem("token"); 
  const response = await jsonClient.post(
    `/admin/approve_claim/${match_id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        role: "admin",
      },
    }
  );
  return response.data;
};

// Reject claim request from admin/routes.py
export const rejectClaim = async (match_id) => {
  const token = localStorage.getItem("token");
  const response = await jsonClient.post(
    `/admin/reject_claim/${match_id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        role: "admin",
      },
    }
  );
  return response.data;
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
