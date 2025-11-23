import React, { useState, useEffect } from "react";
import AdminNavBar from '../../../components/layout/AdminNavBar';
import CircularLoad from "../../../components/ui/CircularLoad";
import {
  getAllMatches,
  approveClaim,
  rejectClaim,
} from "../../../api/admin";

const ClaimRequest = () => {
  const [pendingClaims, setPendingClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

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
    <div className="mb-6">
      <div className={selectedMatch ? "blur-sm pointer-events-none" : ""}>
        <AdminNavBar />
        <h2 className="flex justify-center text-lg font-semibold mt-10 text-white">
          Pending Claim Requests
        </h2>

        {loading ? (
          <div className='flex flex-col items-center gap-5 mt-20'>
            <span>Loading Entries...</span>
            <CircularLoad />
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-10 mt-10">
            {pendingClaims.length === 0 ? (
              <p className="text-center text-gray-500">
                No pending claims found.
              </p>
            ) : (
              pendingClaims.map((match) => {
                const imageUrl =
                  match.lost_item?.photo_url || match.found_item?.photo_url;
                const itemName =
                  match.lost_item?.item_name ||
                  match.found_item?.item_name ||
                  "Unnamed Item";

                return (
                  <div
                    key={match.match_id}
                    className="w-64 bg-gray-800 text-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform hover:scale-105 flex flex-col justify-between"
                  >
                    <div className="flex flex-col items-center px-3 pt-4 text-center">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-white">
                        {itemName}
                      </h3>

                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Item"
                          className="w-full h-44 object-cover rounded-lg shadow-sm"
                        />
                      ) : (
                        <div className="w-full h-44 bg-gray-700 flex items-center justify-center rounded-lg text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex justify-around bg-gray-700 py-2 px-2 mt-3">
                      <button
                        onClick={() => handleApprove(match.match_id)}
                        disabled={processing === match.match_id}
                        className={`text-xs px-3 py-1 rounded-md font-semibold transition ${
                          processing === match.match_id
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(match.match_id)}
                        disabled={processing === match.match_id}
                        className={`text-xs px-3 py-1 rounded-md font-semibold transition ${
                          processing === match.match_id
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        Reject
                      </button>
                    </div>

                    <div className="bg-gray-700 py-2 flex justify-center border-t border-gray-600">
                      <button
                        onClick={() => setSelectedMatch(match)}
                        className="text-xs px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 font-semibold transition"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {selectedMatch && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 bg-black/30 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedMatch(null); }}
        >
          <div className="bg-slate-600 rounded-2xl shadow-lg w-11/12 md:w-2/3 p-6 relative overflow-y-auto max-h-[90vh] text-white">

            <button
              onClick={() => setSelectedMatch(null)}
              className="absolute top-3 right-3 text-white hover:text-gray-300 text-xl"
            >
              ✕
            </button>

            <h3 className="text-center text-xl font-semibold mb-4 text-white">
              Match Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lost Item */}
              <div className="border rounded-xl p-4 bg-gray-800 flex flex-col">
                <p className="text-sm mb-2 font-semibold text-gray-200">
                  {selectedMatch.lost_user?.first_name} {selectedMatch.lost_user?.last_name}
                </p>
                {selectedMatch.lost_item?.photo_url ? (
                  <img
                    src={selectedMatch.lost_item.photo_url}
                    alt="Lost item"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-400 flex items-center justify-center rounded-lg mb-3 text-white">
                    No Image
                  </div>
                )}
                <p><strong>Name:</strong> {selectedMatch.lost_item?.item_name || "N/A"}</p>
                <p><strong>Description:</strong> {selectedMatch.lost_item?.description || "N/A"}</p>
                <p><strong>Pickup Location:</strong> {selectedMatch.lost_item?.pickup_location || "N/A"}</p>
              </div>

              {/* Found Item */}
              <div className="border rounded-xl p-4 bg-gray-800 flex flex-col">
                <p className="text-sm mb-2 font-semibold text-gray-200">
                  {selectedMatch.found_user?.first_name} {selectedMatch.found_user?.last_name}
                </p>
                {selectedMatch.found_item?.photo_url ? (
                  <img
                    src={selectedMatch.found_item.photo_url}
                    alt="Found item"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-400 flex items-center justify-center rounded-lg mb-3 text-white">
                    No Image
                  </div>
                )}
                <p><strong>Name:</strong> {selectedMatch.found_item?.item_name || "N/A"}</p>
                <p><strong>Description:</strong> {selectedMatch.found_item?.description || "N/A"}</p>
                <p><strong>Pickup Location:</strong> {selectedMatch.found_item?.pickup_location || "N/A"}</p>
              </div>
            </div>

            <div className="flex justify-center mt-6 gap-4">
              <button
                onClick={() => handleApprove(selectedMatch.match_id)}
                disabled={processing === selectedMatch.match_id}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
