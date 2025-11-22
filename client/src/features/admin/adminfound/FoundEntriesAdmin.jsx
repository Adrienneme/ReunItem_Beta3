import React, { useState, useEffect } from "react";
import AdminNavBar from "../../../components/layout/AdminNavBar";
import FoundBaseForm from "../../../components/forms/FoundBaseForm";
import { deleteSubmission } from "../../../api/admin";
import { getItem } from "../../../api/items";
import { useLocation } from "react-router-dom";
import { approveClaimRequest } from '../../../api/admin';

export default function FoundEntriesView() {
  const [entry, setEntry] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { entry_id } = location.state;

  useEffect(() => {
    let isMounted = true;

    const fetchEntry = async () => {
      try {
        const response = await getItem(entry_id);
        if (isMounted) setEntry(response);
      } catch (error) {
        if (isMounted) setError("No Entry Found.");
      } finally {
        if (isMounted) setLoading(false);
      }
      console.log("ITEM DATA:", entry);
    };

    fetchEntry();
    return () => {
      isMounted = false;
    };
  }, [entry_id]);

  const handleDelete = async (entryId) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;
    try {
      const response = await deleteSubmission(entryId);
      alert(response.message);
    } catch (error) {
      const errMsg = error.response?.data?.detail || "Failed to delete submission.";
      alert(errMsg);
    }
  };

  // ❗ REMOVED the invalid console.log here

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
      console.error("Claim approval failed:", error);
    }
  };

  const handleImageSelect = (file) => {
    if (entry.photo_url) {
      alert("You cannot change the existing photo.");
      return;
    }
    setEntry((prev) => ({ ...prev, photo: file }));
  };

  const handlePickupChange = (val) => {
    setEntry((prev) => ({ ...prev, pickup_location: val }));
  };

  const handleChange = (field, value) => {
    setEntry((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <div>Loading entry...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mb-6">
      <AdminNavBar />
      <div className="flex flex-col items-center justify-center mx-5">
        <div>
          <FoundBaseForm
            label={entry.type}
            formData={entry}
            existingPhoto={entry.photo_url}
            onChange={handleChange}
            onImageSelect={handleImageSelect}
            onPickupChange={handlePickupChange}
            disableImageUpload={!!entry.photo_url}
          />
        </div>

     <div className="flex flex-row gap-10 mt-3">

 <button
  //debugg
   onClick={async () => {
    if (!window.confirm("Are you sure you want to approve this match and finalize the claim? This action cannot be undone.")) {
      return;
    }

    try {
      // Log the entryId and status before updating
      console.log("Updating status for entry:", entry.entryId, { status: "Claimed" });

      // Update status to "Claimed"
      await updateMutation.mutateAsync({
        entry_id: entry.entryId,
        formData: { status: "Claimed" },
      });

      // Approve the match if matchId exists
      const matchId = entry.matchId || entry.match_id;
      if (matchId) {
        const response = await approveClaimRequest(matchId);
        alert(response.message || `Match ${matchId} approved and items claimed successfully.`);
      } else {
        alert("Item status updated to 'Claimed', but no match ID was found to approve.");
      }

    } catch (error) {
      const errMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to claim item. Please check network and permissions.";
      alert(`Claim Failed: ${errMsg}`);
      console.error("Claim/Update failed:", error);
    }
  }}
  className="mt-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition h-10"
>
  Item Claimed
</button>

  <button
    onClick={async () => {
      if (!window.confirm("Are you sure you want to delete this submission?")) return;
      try {
        const response = await deleteSubmission(entry.entryId);
        alert(response.message);
      } catch (error) {
        const errMsg = error.response?.data?.detail || "Failed to delete submission.";
        alert(errMsg);
      }
    }}
    className="mt-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition h-10"
  >
    Delete Entry
  </button>
</div>

      </div>
    </div>
  );
}
