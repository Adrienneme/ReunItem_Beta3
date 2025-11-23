import React from "react";
import AdminNavBar from "../../../components/layout/AdminNavBar";
import LostBaseForm from "../../../components/forms/LostBaseForm";
import CircularLoad from "../../../components/ui/CircularLoad";
import { useLocation, useNavigate } from "react-router-dom";
import { useFetchItem } from "../../../hooks/useFetch";
import { approveItem } from "../../../api/admin";

export default function LostEntriesView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { entry_id } = location.state;

<<<<<<< HEAD
  const { user, formData: entry, isPending, error } = useFetchItem("found", entry_id);
=======
  const { user, formData: entry, isPending, error } = useFetchItem("lost", entry_id);
>>>>>>> d33a39a (LostEntrisAdmin update)

  if (isPending || error) {
    return (
      <div>
        <AdminNavBar />
        <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg mt-20">
          {isPending ? (
            <div className="flex flex-col items-center gap-5">
              <span>Loading Entry Details...</span>
              <CircularLoad />
            </div>
          ) : (
            <span>{error.message}</span>
          )}
        </div>
      </div>
    );
  }

  const handleApprove = async () => {
    const id = entry.entryId || entry.entry_id || entry.entry_Id;
    if (!id) {
      alert("Entry ID is missing.");
      return;
    }

    try {
      await approveItem(id);
<<<<<<< HEAD
      alert(`Item marked as FOUND/LOST (Claimed).`);
=======
      alert("Item marked as FOUND/LOST (Claimed).");
>>>>>>> d33a39a (LostEntrisAdmin update)
      navigate("/admin/lostandfoundrep");
    } catch (err) {
      alert("Failed to update item.");
      console.error(err);
    }
  };

  return (
    <div>
      <AdminNavBar />
      <div className="flex flex-col items-center justify-center mx-5 mb-10">
        <LostBaseForm
          title="Lost Item Details:"
          formData={entry}
          user={user}
          existingPhoto={entry.photo_url}
          disabled={true}
        />

        <div className="flex flex-row gap-10 mt-3">
          <button
            onClick={() => navigate("/admin/lostandfoundrep")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Go Back
          </button>

          <button
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            onClick={handleApprove}
          >
            Item Found
          </button>
        </div>
      </div>
    </div>
  );
}
