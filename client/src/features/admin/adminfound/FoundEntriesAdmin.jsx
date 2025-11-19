import React, { useState, useEffect } from "react";
import AdminNavBar from "../../../components/layout/AdminNavBar";
import FoundBaseForm from "../../../components/forms/FoundBaseForm";

import { deleteSubmission } from "../../api/admin";
import { getItem } from "../../api/items";
import { useApproveClaim } from '../../hooks/useApproveClaim';


export default function FoundEntriesView() {
  const { entry_id: paramEntryId } = useParams(); // URL param
  const navigate = useNavigate();
  const savedEntryId = localStorage.getItem("entry_id"); // fallback
  const entry_id = paramEntryId || savedEntryId;

  const [entry, setEntry] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const approveClaim = useApproveClaim();

  // Fetch entry details
  useEffect(() => {
    let isMounted = true;

    if (!entry_id) {
      setError("No entry ID provided.");
      setLoading(false);
      return;
    }

    const fetchEntry = async () => {
      try {
        const response = await getItem(entry_id);
        if (isMounted) setEntry(response);
      } catch (err) {
        if (isMounted) setError("No entry found.");
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEntry();
    return () => {
      isMounted = false;
    };
  }, [entry_id]);

  // Delete entry
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;

    try {
      const response = await deleteSubmission(id);
      alert(response.message);
      navigate("/admin/home"); // redirect after deletion
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to delete submission.");
    }
  };

  // Image upload
  const handleImageSelect = (file) => {
    if (entry.photo_url) {
      alert("You cannot change the existing photo.");
      return;
    }
    setEntry((prev) => ({ ...prev, photo: file }));
  };

  // Pickup location
  const handlePickupChange = (val) => {
    setEntry((prev) => ({ ...prev, pickup_location: val }));
  };

  // Generic field update
  const handleChange = (field, value) => {
    setEntry((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <div>Loading entry...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mb-6">
      <AdminNavBar />
      <div className="flex flex-col items-center justify-center mx-5">
        <FoundBaseForm
          label={entry.type || "Item"}  // Restore proper label
          formData={entry}
          existingPhoto={entry.photo_url}
          onChange={handleChange}
          onImageSelect={handleImageSelect}
          onPickupChange={handlePickupChange}
          disableImageUpload={!!entry.photo_url}
        />

        <div className="flex flex-row gap-10 mt-3">
          <button
            onClick={() => {
              if (!window.confirm("Mark this item as Claimed?")) return;
              const matchId = entry.matchId || entry.match_id;
              if (!matchId) {
                alert("Match ID missing!");
                return;
              }
              approveClaim.mutate(matchId);
            }}
            className="mt-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition h-10"
          >
            Item Claimed
          </button>

          <button
            onClick={() => handleDelete(entry.entryId)}
            className="mt-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition h-10"
          >
            Delete Submission
          </button>
        </div>
      </div>
    </div>
  );
}
