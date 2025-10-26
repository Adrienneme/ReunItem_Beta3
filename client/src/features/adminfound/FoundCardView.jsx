import React, { useEffect, useState } from "react";
import UserNavBar from "../../components/layout/UserNavBar";
import FoundBaseForm from "../../components/forms/FoundBaseForm"; 
import { useNavigate } from "react-router-dom";
import ButtonUI from "../../components/ui/ButtonUI";
import MessageBox from "../../components/ui/MessageBox";

export default function FoundViewPage() {
  const [entry, setEntry] = useState({});
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonloading] = useState(false);
  const [error, setError] = useState(null);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const entry_id = localStorage.getItem("entry_id");
  const navigate = useNavigate();

  // Fetch entry details
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
    return () => { isMounted = false; };
  }, [entry_id]);

  /* 🟥 REJECT ENTRY ---------------------------------- */
  const handleReject = () => {
    setShowRejectConfirm(true);
  };

  const confirmReject = async () => {
    try {
      await deleteItem(entry_id); // backend call to reject/delete
      alert("Entry rejected successfully!");
      navigate("/user/found-entries");
    } catch (error) {
      alert("Failed to reject entry.");
      console.error(error);
    } finally {
      setShowRejectConfirm(false);
    }
  };

  const cancelReject = () => {
    setShowRejectConfirm(false);
  };
  /* -------------------------------------------------- */

  /* 🟩 ACCEPT ENTRY ----------------------------------- */
  const handleAccept = async () => {
    setButtonloading(true);
    try {
      // here you can add API logic later if needed (e.g., mark as accepted)
      alert("Entry accepted successfully!");
      navigate("/user/found-entries");
    } catch (error) {
      alert("Failed to accept entry.");
      console.error(error);
    } finally {
      setButtonloading(false);
    }
  };
  /* -------------------------------------------------- */

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
      <div className="flex flex-col items-center justify-center mx-5">
        <div>
          <FoundBaseForm
            title="Found Item Details:"
            status={entry.status}
            formData={entry}
            disabled={true} // read-only mode
            existingPhoto={entry.photo_url}
          />
        </div>

        <div className="flex flex-row items-center mt-10 mb-10 gap-10">
          <ButtonUI variant="solid" color="neutral" onClick={() => navigate("/user/found-entries")}>
            Go Back
          </ButtonUI>

          {/* 🟥 REJECT BUTTON */}
          <ButtonUI variant="solid" color="danger" onClick={handleReject}>
            Reject Entry
          </ButtonUI>

          {/* 🟩 ACCEPT BUTTON */}
          <ButtonUI
            variant="solid"
            color="success"
            onClick={handleAccept}
            loading={buttonLoading}
            disabled={buttonLoading}
          >
            Accept Entry
          </ButtonUI>
        </div>
      </div>

      {/* 🟥 REJECT CONFIRMATION POPUP */}
      <MessageBox
        show={showRejectConfirm}
        message="Are you sure you want to reject this entry?"
        onConfirm={confirmReject}
        onCancel={cancelReject}
      />
    </div>
  );
}