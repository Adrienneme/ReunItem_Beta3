import React, { useState, useEffect } from "react";
import AdminNavBar from "../../../components/layout/AdminNavBar";
import LostBaseForm from "../../../components/forms/LostBaseForm";
import { approveEntry } from "../../../api/admin";
import { getItem } from "../../../api/items";
import { useLocation } from "react-router-dom";

export default function LostCardView() {
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
    };

    fetchEntry();
    return () => {
      isMounted = false;
    };
  }, [entry_id]);

  const handleApprove = async (entryId) => {
    if (!window.confirm("Are you sure you want to approve this item?")) return;
    try {
      const response = await approveEntry(entryId);
      alert(response.message);
    } catch (error) {
      const errMsg = error.response?.data?.detail || "Failed to approve item.";
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
          <LostBaseForm
            title="Item Status:"
            status={entry.status}
            formData={entry}
            existingPhoto={entry.photo_url}
            onChange={handleChange}
            onImageSelect={handleImageSelect}
            disableImageUpload={!!entry.photo_url} // 👈 Added flag
          />
        </div>

        <button
          onClick={() => handleApprove(entry.entry_id)}
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Approve
        </button>
      </div>
    </div>
  );
}