import jsonClient from "../api/axios/jsonClient";

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

//  Approve Entry
// test for approve function
export const approveEntry = async (entryId) => {
  try {
    const response = await jsonClient.post(`/admin/approve_entry/${entryId}`, null, {
      headers: { role: 'admin' },
    });
    return response.data;
  } catch (error) {
    console.error(" Failed to approve entry:", error);
    throw error;
  }
};

// test for reject function
export const rejectEntry = async (entryId) => {
  const response = await jsonClient.post(
    `/admin/reject_entry/${entryId}`,
    {},
    {
      headers: {
        role: 'admin',
      },
    }
  );
  return response.data;
};

// test for Delete Submission
export const deleteSubmission = async (entryId) => {
  const response = await jsonClient.delete(
    `/admin/delete_entry/${entryId}`,
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




//============Pending CLAIM request===================
//  Fetch all pending matches
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



//Claim status update (lost and found)
// Example API call function using jsonClient (like Axios)
export const approveClaimRequest = async (match_id) => {
  try {
    // This maps directly to your @admin_claims_router.post("/approve_claim/{match_id}") endpoint
    const response = await jsonClient.post(`/admin/approve_claim/${match_id}`, null, {
      headers: { role: 'admin' },
    });
    return response.data;
  } catch (error) {
    // This throws the error object that is caught by the handleClaim function
    console.error(" Failed to approve claim request:", error);
    throw error; 
  }
};

//

// New API for approving any lost/found item
export const approveItem = async (entryId) => {
  try {
    const response = await jsonClient.post(
      `/admin/approve_item/${entryId}`,
      null,
      { headers: { role: "admin" } }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to approve item:", error);
    throw error;
  }
};


// ================= Backup & Restore =================

// Backup all tables (download)
export const backupAllTables = async () => {
  try {
    const response = await jsonClient.get("/admin/backup_all", {
      responseType: "blob", // Treat as file
      headers: { role: "admin" },
    });

    const blob = new Blob([response.data], { type: "application/json" }); //convert binary response to downloadable file
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Use filename from headers or fallback
    const filename = response.headers["content-disposition"]
      ? response.headers["content-disposition"].split("filename=")[1]
      : `backup_${new Date().toISOString()}.json`;

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    return { message: "Backup downloaded successfully", filename };
  } catch (error) {
    console.error("Failed to backup all tables:", error);
    throw error;
  }
};

// Restore all tables (automatic latest backup)
export const restoreAllTables = async () => {
  try {
    const response = await jsonClient.post("/admin/restore_all", null, {
      headers: { role: "admin" },
      timeout: 10 * 60 * 1000, // 10 minutes
    });

    return response.data;
  } catch (error) {
    console.error("Failed to restore database:", error);
    throw error;
  }
};