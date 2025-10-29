import React, { useEffect, useState } from "react";
import UserNavBar from "../../../../components/layout/UserNavBar";
import FoundBaseForm from "../../../../components/forms/FoundBaseForm";
import { getItem, deleteItem, updateItem, generateDescription, getMatch } from "../../../../api/items";
import { useNavigate } from "react-router-dom";
import ButtonUI from "../../../../components/ui/ButtonUI";
import MessageBox from "../../../../components/ui/MessageBox";

export default function FoundViewPage() {
  const [entry, setEntry] = useState({});
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonloading] = useState(false);
  const [generateLoading, setGenerateloading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [replace, setReplace] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const entry_id = localStorage.getItem("entry_id");
  const navigate = useNavigate();

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

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteItem(entry_id);
      alert("Entry deleted successfully!");
      navigate("/user/found-entries");
    } catch (error) {
      alert("Failed to delete entry.");
      console.error(error);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleEdit = () => {
    setDisabled(false);
    setReplace(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (file) => {
    setEntry(prev => ({ ...prev, photo: file }));
  };

  const handlePickupChange = (val) => {
    setEntry(prev => ({ ...prev, pickup_location: val }));
  };

  const handleGenerate = async () => {

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonloading(true);

    if (!entry.item_name || !entry.description || !entry.photo || !entry.pickup_location) {
      alert('Please provide your changes and fill all inputs, Image of Item is required');
      setButtonloading(false);
      return;
    }

    try {
      const response = await updateItem(entry.entry_id, entry);
      console.log("Successfully created Item:", response.photo)
      alert('Entry Edited!')
      navigate('/user/found-entries')

    } catch (error) {
      const errMsg = error.response?.data?.detail || "Failed to submit entry.";
      console.log(error.response?.data.detail);
      alert(errMsg);
    } finally {
      setButtonloading(false);
    }
  };

  const handleViewClaim = async () => {
    try {
      const response = await getMatch(entry.entry_id);
      localStorage.setItem("entry_id", response.lost_entry_id);
      localStorage.setItem("foundentry_id", entry.entry_id);
      localStorage.setItem("similarity", response.similarity);
      navigate('/user/matched-lost-detail');

    } catch (error) {
      const errMsg = error.response?.data?.detail || "Failed to cancel claim.";
      console.log(error.response?.data.detail);
      alert(errMsg);
    }
  }

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

  return (
    <div>
      <UserNavBar />
      <div className="flex flex-col items-center justify-center mx-5">
        <div>
          <FoundBaseForm
            title="Found Item Details:"
            status={entry.status}
            formData={entry}
            disabled={disabled}
            existingPhoto={entry.photo_url}
            onChange={handleChange}
            onImageSelect={handleImageSelect}
            loading={generateLoading}
            onGenerate={handleGenerate}
            onPickupChange={handlePickupChange}
          />
        </div>

        <div className="flex flex-row items-center mt-10 mb-10 gap-10">

          {entry.status == "Pending Claim" && (
            <>
              <ButtonUI variant="solid" color="neutral" onClick={() => navigate("/user/found-entries")}>
                Go Back
              </ButtonUI>
              <ButtonUI
                variant="solid"
                color="success"
                onClick={handleViewClaim}
              >
                View Claimed Match
              </ButtonUI>
            </>
          )}

          {["Pending Approval", "Approved"].includes(entry.status) && (
            <>
              <ButtonUI variant="solid" color="neutral" onClick={() => navigate("/user/found-entries")}>
                Go Back
              </ButtonUI>

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
            </>
          )}
        </div>
      </div>

      <MessageBox
        show={showDeleteConfirm}
        message="Are you sure you want to delete this entry?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
