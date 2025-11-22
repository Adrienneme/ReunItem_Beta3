import React, { useState } from "react";
import AdminNavBar from "../../../components/layout/AdminNavBar";
import FoundBaseForm from "../../../components/forms/FoundBaseForm";
import CircularLoad from "../../../components/ui/CircularLoad";
import { useLocation, useNavigate } from "react-router-dom";
import { approveClaimRequest } from "../../../api/admin";
import { getItem } from "../../../api/items";
import { useQuery } from "@tanstack/react-query";

export default function FoundEntriesView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { entry_id } = location.state;

  const {
    data: entry,
    isPending,
    error,
  } = useQuery({
    queryKey: ["found-entry", entry_id],
    queryFn: () => getItem(entry_id),
  });

  const handleClaim = async (match_id) => {
    if (!window.confirm("Are you sure you want to approve this match and finalize the claim? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await approveClaimRequest(match_id);
      alert(response.message || `Match ${match_id} approved and items claimed successfully.`);
    } catch (error) {
      const errMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to process the claim. Please check network and permissions.";

      alert(`Claim Failed: ${errMsg}`);
    }
  };

  if (isPending || error) {
    return (
      <div>
        <AdminNavBar />
        <div className="min-h-screen flex justify-center mt-35 text-gray-600 text-lg">
          {isPending ?
            <div className='flex flex-col items-center gap-5'>
              <span>Loading Entry Details...</span>
              <CircularLoad />
            </div> : error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <AdminNavBar />
      <div className="flex flex-col items-center justify-center mx-5">
        <div>
          <FoundBaseForm
            title="Found Item Details:"
            label={entry.type}
            formData={entry}
            existingPhoto={entry.photo_url}
            disabled={true}
          />
        </div>

        <div className="flex flex-row gap-10 mt-5">
          <button
            onClick={() => { navigate("/admin/lostandfoundrep"); }}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Go Back
          </button>

          <button
            onClick={() => {
              const matchId = entry.matchId || entry.match_id;
              if (!matchId) {
                alert("Cannot approve claim: match ID is missing.");
                return;
              }
              handleClaim(matchId);
            }}
            className="mt-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition h-10"
          >
            Item Claimed
          </button>
        </div>
      </div>
    </div>
  );
}
