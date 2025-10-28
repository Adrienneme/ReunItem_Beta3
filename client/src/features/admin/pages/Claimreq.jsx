
//Test function backend, update backend reject and accept claim working
import React, { useState, useEffect } from 'react';
import UserNavBar from '../../../components/layout/UserNavBar';
import Cards from '../../../components/ui/Cards';
import { admin_claims_pending, approveClaim, rejectClaim } from '../../../api/admin'; 

const ClaimRequest = () => {
  const [pendingClaims, setPendingClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null); // track which claim is being processed

  // Fetch pending claims
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await admin_claims_pending();
        const pendingItems = data.claims.map((claim) => claim.pending_item);
        setPendingClaims(pendingItems);
      } catch (error) {
        console.error("Error fetching pending claims:", error);
        alert("Failed to load pending claims.");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  // Approve claim
  const handleApprove = async (entryId) => {
    if (!window.confirm("Approve this claim?")) return;
    try {
      setProcessing(entryId);
      const response = await approveClaim(entryId);
      alert(response.message);
      setPendingClaims((prev) => prev.filter((item) => item.entry_id !== entryId));
    } catch (error) {
      console.error("Error approving claim:", error);
      alert(error.response?.data?.detail || "Failed to approve claim.");
    } finally {
      setProcessing(null);
    }
  };

  // Reject claim
  const handleReject = async (entryId) => {
    if (!window.confirm("Reject this claim?")) return;
    try {
      setProcessing(entryId);
      const response = await rejectClaim(entryId);
      alert(response.message);
      setPendingClaims((prev) => prev.filter((item) => item.entry_id !== entryId));
    } catch (error) {
      console.error("Error rejecting claim:", error);
      alert(error.response?.data?.detail || "Failed to reject claim.");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div>
      <UserNavBar />
      <h2 className="flex justify-center text-lg font-semibold mt-10">
        Pending Claim Requests
      </h2>

      {loading ? (
        <p className="text-center mt-10">Loading pending claims...</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-10 mt-10">
          {pendingClaims.length === 0 ? (
            <p className="text-center text-gray-500">No pending claims found.</p>
          ) : (
            pendingClaims.map((item) => (
              <div key={item.entry_id} className="flex flex-col items-center">
                <Cards
                  name={item.item_name}
                  imageUrl={item.photo_url}
                  status={item.status}
                  linkTo="/admin/foundcardview"
                  stateData={item}
                />

                {/* Action Buttons */}
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleApprove(item.entry_id)}
                    disabled={processing === item.entry_id}
                    className={`px-4 py-2 rounded-lg text-white transition ${
                      processing === item.entry_id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black hover:bg-gray-800"
                    }`}
                  >
                    {processing === item.entry_id ? "Processing..." : "Approve"}
                  </button>

                  <button
                    onClick={() => handleReject(item.entry_id)}
                    disabled={processing === item.entry_id}
                    className={`px-4 py-2 rounded-lg text-white transition ${
                      processing === item.entry_id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {processing === item.entry_id ? "Processing..." : "Reject"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ClaimRequest;
