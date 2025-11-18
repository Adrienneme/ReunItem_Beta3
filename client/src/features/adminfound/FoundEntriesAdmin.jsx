import React, { useState, useEffect } from "react";
import AdminNavBar from "../../components/layout/AdminNavBar";
import FoundBaseForm from "../../components/forms/FoundBaseForm";
import { deleteSubmission } from "../../api/admin";
import { getItem } from "../../api/items";

export default function FoundEntriesView() {
  const [entry, setEntry] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const entry_id = localStorage.getItem("entry_id");

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

  const handleImageSelect = (file) => {
    // Disable changing photo if one already exists
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
    <div>
      <AdminNavBar />
      <div className="flex flex-col items-center justify-center mx-5">
        <div>
          <FoundBaseForm
            title="Item Status:"
            status={entry.status}
            formData={entry}
            existingPhoto={entry.photo_url}
            onChange={handleChange}
            onImageSelect={handleImageSelect}
            onPickupChange={handlePickupChange}
            disableImageUpload={!!entry.photo_url} // 👈 Added flag
          />
        </div>

         <button
          onClick="/admin/home"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition mt-3"
        >
          Item Found
        </button>
        <button
          onClick={() => handleDelete(entry.entryId)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition mt-3"
        >
          Delete Submission
        </button>
        
      </div>
    </div>
  );
}

