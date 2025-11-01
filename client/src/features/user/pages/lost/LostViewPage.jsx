import React, { useEffect, useState } from "react";
import UserNavBar from "../../../../components/layout/UserNavBar";
import LostBaseForm from "../../../../components/forms/LostBaseForm";
import { getItem, deleteItem, updateItem, generateDescription, getMatch, delClaim } from "../../../../api/items";
import { Link, useNavigate } from "react-router-dom";
import ButtonUI from "../../../../components/ui/ButtonUI";
import MessageBox from "../../../../components/ui/MessageBox";

export default function LostViewPage() {
  const [entry, setEntry] = useState({});
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonloading] = useState(false);
  const [generateLoading, setGenerateloading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelConfirm, setshowCancelConfirm] = useState(false);
  const [replace, setReplace] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const entry_id = localStorage.getItem("entry_id");
  const navigate = useNavigate();

  useEffect(() => { //get and transfer formdata here
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

  //w
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };
  //w
  const confirmDelete = async () => {
    try {
      await deleteItem(entry_id);
      alert("Entry deleted successfully!");
      navigate("/user/lost-entries");
    } catch (error) {
      alert("Failed to delete entry.");
      console.error(error);
    } finally {
      setShowDeleteConfirm(false);
    }
  };
  //w
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };
  //w
  const handleEdit = () => {
    setDisabled(false);
    setReplace(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntry(prev => ({ ...prev, [name]: value })); //form
  };

  const handleImageSelect = (file) => {
    setEntry(prev => ({ ...prev, photo: file })); //form
  };

  const handleGenerate = async () => { //form

    if (!entry.photo) {
      alert("No photo found!");
      return;
    }
    setGenerateloading(true);

    try {
      const response = await generateDescription(entry.photo);
      console.log("Backend response:", response);
      setEntry(prev => ({
        ...prev, description: response.description
      }));

    } catch (error) {
      console.error("Error generating description:", error);
      const errMsg = error.response?.data?.detail || "Failed to generate description.";
      alert(errMsg);
    } finally {
      setGenerateloading(false);
    }
  };
//copy
  const handleSubmit = async (e) => { //form
    e.preventDefault();
    setButtonloading(true);

    if (!entry.item_name || !entry.description) {
      alert('Please provide your changes and fill all inputs.');
      setButtonloading(false);
      return;
    }

    try {
      const response = await updateItem(entry.entry_id, entry);
      console.log("Successfully updated Item:", response.photo);
      alert('Entry Edited!');
      navigate('/user/lost-entries');

    } catch (error) {
      const errMsg = error.response?.data?.detail || "Failed to submit entry.";
      console.log(error.response?.data.detail);
      alert(errMsg);
    } finally {
      setButtonloading(false);
    }

    //mutations
  };

  if (loading) {
    return (
      <div>
        <UserNavBar />
        <div className="min-h-screen flex justify-center mt-50 text-gray-600 text-lg">
          Loading entry details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <UserNavBar />
        <div className="min-h-screen flex justify-center mt-50 text-red-600 text-lg">
          {error}
        </div>
      </div>
    );
  }
  const cancelClaimCancel = () => {
    setshowCancelConfirm(false)
  }
  const confirmClaimCancel = () => {
    setshowCancelConfirm(true)
  }

  const handleClaimCancel = async () => {
    try {
      const response = await delClaim(entry.entry_id);
      alert(response.message);
      navigate('/user/lost-entries');

    } catch (error) {
      const errMsg = error.response?.data?.detail || "Failed to cancel claim.";
      console.log(error.response?.data.detail);
      alert(errMsg);
    }
  }

  const handleViewClaim = async () => {
    try {
      const response = await getMatch(entry.entry_id);
      localStorage.setItem("entry_id", response.found_entry_id);
      localStorage.setItem("lostentry_id", entry.entry_id);
      localStorage.setItem("similarity", response.similarity);
      navigate('/user/matched-entry-detail');

    } catch (error) {
      const errMsg = error.response?.data?.detail || "Failed to cancel claim.";
      console.log(error.response?.data.detail);
      alert(errMsg);
    }
  }

  return (
    <div>
      <UserNavBar />
      <div className="flex flex-col items-center justify-center mx-5">
        <div>
          <LostBaseForm
            title="Lost Item Details:"
            status={entry.status}
            formData={entry}
            disabled={disabled}
            existingPhoto={entry.photo_url}
            onChange={handleChange}
            onImageSelect={handleImageSelect}
            loading={generateLoading}
            onGenerate={handleGenerate}
          />
        </div>

        <div className="flex flex-col items-center mb-10 gap-10">
          <div className="flex flex-row items-center mt-5 gap-10">
            <ButtonUI variant="solid" color="neutral" onClick={() => navigate("/user/lost-entries")}>
              Go Back
            </ButtonUI>

            {["Pending Approval", "Approved"].includes(entry.status) && (
              <div className="flex flex-row items-center gap-10">
                <ButtonUI variant="solid" color="danger" onClick={handleDelete}>
                  Delete Entry
                </ButtonUI>

                {replace ? (
                  <ButtonUI variant="solid" color="warning" onClick={handleEdit}>
                    Edit Entry
                  </ButtonUI>
                ) : (
                  <ButtonUI
                    variant="solid"
                    color="success"
                    onClick={handleSubmit}
                    loading={buttonLoading}
                    disabled={buttonLoading}
                  >
                    Confirm Edit
                  </ButtonUI>
                )}
              </div>
            )}

            {["Pending Claim"].includes(entry.status) && (
              <div className="flex flex-row items-center gap-10">
                <ButtonUI variant="solid" color="danger" onClick={confirmClaimCancel}>
                  Cancel Claim
                </ButtonUI>

                <ButtonUI
                  variant="solid"
                  color="success"
                  onClick={handleViewClaim}
                >
                  View Claimed Match
                </ButtonUI>
              </div>
            )}

          </div>
          <div>
            {entry.status === "Approved" && ( //change to Approved later
              <ButtonUI
                color="primary"
                onClick={() => {
                  navigate("/user/matched-entries")
                }}
              >
                View Potential Matches
              </ButtonUI>
            )}
          </div>

        </div>
      </div>

      <MessageBox
        show={showDeleteConfirm}
        message="Are you sure you want to delete this entry?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <MessageBox
        show={showCancelConfirm}
        message="Are you sure you want to Cancel Claim?"
        onConfirm={handleClaimCancel}
        onCancel={cancelClaimCancel}
      />
    </div>
  );
}
