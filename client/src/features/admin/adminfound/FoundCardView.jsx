import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";

import AdminNavBar from "../../../components/layout/AdminNavBar";
import FoundBaseForm from "../../../components/forms/FoundBaseForm";
import CircularLoad from "../../../components/ui/CircularLoad";

import { approveEntry, rejectEntry } from "../../../api/admin";
import { useFetchItem } from "../../../hooks/useFetch";
import { useDeleteItem } from "../../../hooks/useEdit";

export default function FoundViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { entry_id } = location.state;

  const [status, setStatus] = useState("");

  const { user, formData: entry, isPending, error } = useFetchItem("found", entry_id);

  const deleteMutation = useDeleteItem("found", "/admin/archived");

  useEffect(() => {
    if (!entry) return;

    if (entry.status === "Claimed" || entry.status === "Rejected") {
      setStatus(entry.status);
    } else {
      setStatus("");
    }
  }, [entry]);

  const approveMutation = useMutation({
    mutationFn: approveEntry,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["pendingItems"]);
      alert(res.message);
      navigate("/admin/pendingsubmissions");
    },
    onError: (error) => {
      alert(error.response?.data?.detail || "Failed to approve item.");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectEntry,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["pendingItems"]);
      alert(res.message);
      navigate("/admin/pendingsubmissions");
    },
    onError: (error) => {
      alert(error.response?.data?.detail || "Failed to reject item.");
    },
  });

  const handleApprove = () => {
    if (!window.confirm("Approve this item?")) return;
    approveMutation.mutate(entry.entry_id);
  };

  const handleReject = () => {
    if (!window.confirm("Reject this item?")) return;
    rejectMutation.mutate(entry.entry_id);
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    deleteMutation.mutate(entry.entry_id);
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
    );
  }

  const showActionButtons = entry.status === "Pending Approval";

  return (
    <div className="mb-6">
      <AdminNavBar />
      <div className="flex flex-col items-center justify-center mx-5">
        <FoundBaseForm
          title="Found Item Details:"
          status={status}
          formData={entry}
          user={user}
          existingPhoto={entry.photo_url}
          disabled
        />

        <div className="flex flex-row gap-10 mt-5">
          {showActionButtons ? (
            <>
              <button
                onClick={handleApprove}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Approve
              </button>

              <button
                onClick={handleReject}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Reject
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate(-1)}
                className="mt-3 bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Go Back
              </button>

              <button
                onClick={handleDelete}
                className="mt-3 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Delete Entry
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
