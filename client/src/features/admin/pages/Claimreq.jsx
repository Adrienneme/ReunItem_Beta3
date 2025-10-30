import React, { useState, useEffect } from "react";
import UserNavBar from "../../../components/layout/UserNavBar";
import Cards from "../../../components/ui/Cards";
import { getAllMatches, approveClaim, rejectClaim } from "../../../api/admin"; // updated imports

const ClaimRequest = () => {
  const [pendingClaims, setPendingClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  // ✅ Fetch all matches and filter unclaimed (is_claimed === false)
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await getAllMatches();
        const unclaimed = data.filter((match) => match.is_claimed === false);
        setPendingClaims(unclaimed);
      } catch (error) {
        console.error("Error fetching pending claims:", error);
        alert("Failed to load pending claims.");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  // ✅ Approve claim
  const handleApprove = async (matchId) => {
    if (!window.confirm("Approve this claim?")) return;
    try {
      setProcessing(matchId);
      const response = await approveClaim(matchId);
      alert(response.message);
      setPendingClaims((prev) =>
        prev.filter((item) => item.match_id !== matchId)
      );
    } catch (error) {
      console.error("Error approving claim:", error);
      alert(error.response?.data?.detail || "Failed to approve claim.");
    } finally {
      setProcessing(null);
    }
  };

  // ✅ Reject claim
  const handleReject = async (matchId) => {
    if (!window.confirm("Reject this claim?")) return;
    try {
      setProcessing(matchId);
      const response = await rejectClaim(matchId);
      alert(response.message);
      setPendingClaims((prev) =>
        prev.filter((item) => item.match_id !== matchId)
      );
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
            pendingClaims.map((match) => (
              <div key={match.match_id} className="flex flex-col items-center">
                <Cards
                  name={`Match ID: ${match.match_id}`}
                  imageUrl={match.image_url}
                  status={match.is_claimed ? "Claimed" : "Unclaimed"}
                  linkTo="/admin/foundcardview"
                  stateData={match}
                />

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleApprove(match.match_id)}
                    disabled={processing === match.match_id}
                    className={`px-4 py-2 rounded-lg text-white transition ${
                      processing === match.match_id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black hover:bg-gray-800"
                    }`}
                  >
                    {processing === match.match_id ? "Processing..." : "Approve"}
                  </button>

                  <button
                    onClick={() => handleReject(match.match_id)}
                    disabled={processing === match.match_id}
                    className={`px-4 py-2 rounded-lg text-white transition ${
                      processing === match.match_id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {processing === match.match_id ? "Processing..." : "Reject"}
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
