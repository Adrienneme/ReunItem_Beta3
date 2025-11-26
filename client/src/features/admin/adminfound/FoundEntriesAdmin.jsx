import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import AdminNavBar from "../../../components/layout/AdminNavBar";
import FoundBaseForm from "../../../components/forms/FoundBaseForm";
import CircularLoad from "../../../components/ui/CircularLoad";

import { useFetchItem } from "../../../hooks/useFetch";
import { approveItem } from "../../../api/admin";

export default function FoundEntriesView() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { entry_id } = location.state;

  const { user, formData: entry, isPending, error } = useFetchItem("found", entry_id);

  const approveMutation = useMutation({
    mutationFn: approveItem,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["adminItems"]); 
      alert(res.message || "Item marked as FOUND (Claimed).");
      navigate("/admin/lostandfoundrep");
    },
    onError: (err) => {
      alert(err.response?.data?.detail || "Failed to update item.");
      console.error(err);
    },
  });

  const handleClaim = () => {
    const id = entry.entryId || entry.entry_id || entry.entry_Id;
    if (!id) return alert("Entry ID is missing.");

    if (!window.confirm("Mark this item as CLAIMED?")) return;

    approveMutation.mutate(id);
  };

  if (isPending || error) {
    return (
      <div>
        <AdminNavBar />
        <div className="min-h-screen flex justify-center mt-35 text-gray-600 text-lg">
          {isPending ? (
            <div className="flex flex-col items-center gap-5">
              <span>Loading Entry Details...</span>
              <CircularLoad />
            </div>
          ) : (
            error.message
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <AdminNavBar />
      <div className="flex flex-col items-center justify-center mx-5">
        <FoundBaseForm
          title="Found Item Details:"
          label={entry.type}
          formData={entry}
          user={user}
          existingPhoto={entry.photo_url}
          disabled={true}
        />

        <div className="flex flex-row gap-10 mt-5">
          <button
            onClick={() => navigate("/admin/lostandfoundrep")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Go Back
          </button>

          <button
            onClick={handleClaim}
            className="mt-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition h-10"
          >
            Item Claimed
          </button>
        </div>
      </div>
    </div>
  );
}
