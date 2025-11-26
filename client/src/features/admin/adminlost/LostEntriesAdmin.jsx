import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import AdminNavBar from "../../../components/layout/AdminNavBar";
import LostBaseForm from "../../../components/forms/LostBaseForm";
import CircularLoad from "../../../components/ui/CircularLoad";

import { approveItem } from "../../../api/admin";
import { useFetchItem } from "../../../hooks/useFetch";

export default function LostEntriesView() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { entry_id } = location.state;

  const { user, formData: entry, isPending, error } = useFetchItem("lost", entry_id);

  const approveMutation = useMutation({
    mutationFn: approveItem,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["adminItems"]);
      alert(res.message || "Item marked as FOUND/LOST (Claimed).");
      navigate("/admin/lostandfoundrep");
    },
    onError: (err) => {
      alert(err.response?.data?.detail || "Failed to update item.");
      console.error(err);
    },
  });

  const handleApprove = () => {
    const id = entry.entryId || entry.entry_id || entry.entry_Id;
    if (!id) {
      alert("Entry ID is missing.");
      return;
    }
    if (!window.confirm("Mark item as FOUND/LOST?")) return;

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
            <span>{error.message || "There was an error loading this entry."}</span>
          )}
        </div>
      </div>
    );
  }


  return (
    <div>
      <AdminNavBar />
      <div className="flex flex-col items-center justify-center mx-5 mb-10">
        <LostBaseForm
          title="Lost Item Details:"
          formData={entry}
          user={user}
          existingPhoto={entry.photo_url}
          disabled
        />

        <div className="flex flex-row gap-10 mt-3">
          <button
            onClick={() => navigate("/admin/lostandfoundrep")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Go Back
          </button>

          <button
            onClick={handleApprove}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            Item Found
          </button>
        </div>
      </div>
    </div>
  );
}
