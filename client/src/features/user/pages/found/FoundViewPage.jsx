import React, { useEffect, useState } from "react";
import UserNavBar from "../../../../components/layout/UserNavBar";
import FoundBaseForm from "../../../../components/forms/FoundBaseForm";
import { getItem } from "../../../../api/items";
import { Link } from "react-router-dom";
import ButtonUI from "../../../../components/ui/ButtonUI";

export default function FoundViewPage() {
  const [entry, setEntry] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const entry_id = localStorage.getItem("entry_id");
    if (!entry_id) {
      setError("No entry ID found.");
      setLoading(false);
      return;
    }

    const fetchEntry = async () => {
      try {
        const response = await getItem(entry_id);
        setEntry(response);
      } catch (error) {
        const errMsg = error.response?.data?.detail || "No Entry Found.";
        console.error(error);
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
        Loading entry details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      <UserNavBar />
      <div className="flex flex-col items-center justify-center mt-10 mx-5">
        <div>
          <FoundBaseForm
            title="Found Item Details:"
            formData={entry}
            disabled={true}
            existingPhoto={entry.photo_url}
          />
        </div>
        <div className="flex flex-row items-center mt-5 mb-10 gap-50">
          <ButtonUI variant="solid" color="neutral">
            <Link to="/user/found-entries">Go Back</Link>
          </ButtonUI>
          <ButtonUI variant="solid" color="warning">
            Edit Entry
          </ButtonUI>
        </div>
      </div>
    </div>
  );
}
