import React, { useState, useEffect } from "react";
import UserNavBar from "../../../components/layout/UserNavBar";
import Cards from "../../../components/ui/Cards";
import {
  getAllMatches,
  approveClaim,
  rejectClaim,
} from "../../../api/admin"; // your API helpers

const ClaimRequest = () => {
  const [pendingClaims, setPendingClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null); //  for popup

  // Fetch all pending claim matches
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const matches = await getAllMatches();
        setPendingClaims(matches || []);
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
  const handleApprove = async (matchId) => {
    if (!window.confirm("Approve this claim?")) return;
    try {
      setProcessing(matchId);
      const response = await approveClaim(matchId);
      alert(response.message);
      setPendingClaims((prev) =>
        prev.filter((item) => item.match_id !== matchId)
      );
      setSelectedMatch(null);
    } catch (error) {
      console.error("Error approving claim:", error);
      alert(error.response?.data?.detail || "Failed to approve claim.");
    } finally {
      setProcessing(null);
    }
  };

  // Reject claim
  const handleReject = async (matchId) => {
    if (!window.confirm("Reject this claim?")) return;
    try {
      setProcessing(matchId);
      const response = await rejectClaim(matchId);
      alert(response.message);
      setPendingClaims((prev) =>
        prev.filter((item) => item.match_id !== matchId)
      );
      setSelectedMatch(null);
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
            <p className="text-center text-gray-500">
              No pending claims found.
            </p>
          ) : (
            pendingClaims.map((match) => (
              <div key={match.match_id} className="flex flex-col items-center">
                <Cards
                  name={`Match ID: ${match.match_id}`}
                  //  Use photo_url instead of image_url
                  imageUrl={
                    match.lost_item?.photo_url || match.found_item?.photo_url
                  }
                  status={match.is_claimed ? "Claimed" : "Unclaimed"}
                />

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => setSelectedMatch(match)} //  show popup
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleApprove(match.match_id)}
                    disabled={processing === match.match_id}
                    className={`px-4 py-2 rounded-lg text-white transition ${
                      processing === match.match_id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black hover:bg-gray-800"
                    }`}
                  >
                    {processing === match.match_id ? "Approving..." : "Approve"}
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
                    {processing === match.match_id ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/*  Popup Modal for Item Details */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-11/12 md:w-2/3 p-6 relative overflow-y-auto max-h-[90vh] text-black">
            <button
              onClick={() => setSelectedMatch(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>

            <h3 className="text-center text-xl font-semibold mb-5 text-black">
              Match Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lost Item */}
              <div className="border rounded-xl p-4 bg-gray-50 text-black">
                <h4 className="text-lg font-semibold mb-2 text-black border-b pb-1">
                  Lost Item
                </h4>
                {selectedMatch.lost_item?.photo_url ? (
                  <img
                    src={selectedMatch.lost_item.photo_url}
                    alt="Lost item"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-3">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedMatch.lost_item?.item_name || "N/A"}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedMatch.lost_item?.description || "N/A"}
                </p>
                <p>
                  <strong>Pickup Location:</strong>{" "}
                  {selectedMatch.lost_item?.pickup_location || "N/A"}
                </p>
              </div>

              {/* Found Item */}
              <div className="border rounded-xl p-4 bg-gray-50 text-black">
                <h4 className="text-lg font-semibold mb-2 text-black border-b pb-1">
                  Found Item
                </h4>
                {selectedMatch.found_item?.photo_url ? (
                  <img
                    src={selectedMatch.found_item.photo_url}
                    alt="Found item"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-3">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedMatch.found_item?.item_name || "N/A"}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedMatch.found_item?.description || "N/A"}
                </p>
                <p>
                  <strong>Pickup Location:</strong>{" "}
                  {selectedMatch.found_item?.pickup_location || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-6 gap-4">
              <button
                onClick={() => handleApprove(selectedMatch.match_id)}
                disabled={processing === selectedMatch.match_id}
                className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Approve
              </button>

              <button
                onClick={() => handleReject(selectedMatch.match_id)}
                disabled={processing === selectedMatch.match_id}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimRequest;
