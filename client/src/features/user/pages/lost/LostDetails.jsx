import React, { useState } from 'react'
import UserNavBar from '../../../../components/layout/UserNavBar'
import LostBaseForm from '../../../../components/forms/LostBaseForm';
import ButtonUI from '../../../../components/ui/ButtonUI'
import MessageBox from '../../../../components/ui/MessageBox';
import { useLocation, useNavigate } from 'react-router-dom'
import { useFetchItem } from '../../../../hooks/useFetch';
import { useDeleteItem } from '../../../../hooks/useEdit';
import CircularLoad from '../../../../components/ui/CircularLoad';

export default function LostDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { entry_id } = location.state;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeleteItem("lost")
  const { formData, isPending, error } = useFetchItem("lost", entry_id);

  if (isPending || error) {
    return (
      <div>
        <UserNavBar />
        <div className="min-h-screen flex justify-center mt-50 text-gray-600 text-lg">
          {isPending ?
            <div className='flex flex-col items-center gap-5'>
              <span>Loading Entry Details...</span>
              <CircularLoad />
            </div> : error.message}
        </div>
      </div>
    )
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(entry_id);
  }

  return (
    <div className='mb-10'>
      <UserNavBar />
      <LostBaseForm
        title="Lost Item Details:"
        status={formData.status}
        formData={formData}
        disabled={true}
        existingPhoto={formData.photo_url}
      />
      <div className='flex flex-col justify-center items-center'>
        {["Claimed", "Rejected", "Archived"].includes(formData.status) && (
          <div className='flex flex-row items-center justify-center mt-5 gap-5'>
            <ButtonUI variant="solid" color="neutral" onClick={() => navigate("/user/lost-entries")}>
              Go Back
            </ButtonUI>
          </div>
        )}
        {["Pending Approval", "Approved"].includes(formData.status) && (
          <div className='flex flex-row items-center justify-center mt-5 gap-5'>
            <ButtonUI variant="solid" color="neutral" onClick={() => navigate("/user/lost-entries")}>
              Go Back
            </ButtonUI>
            <ButtonUI variant="solid" color="danger"
              onClick={() => { setShowDeleteConfirm(true) }}
            >
              Delete Entry
            </ButtonUI>
            <ButtonUI variant="solid" color="warning"
              onClick={() => {
                navigate("/user/lost-details-edit", { state: { formData } })
              }}>
              Edit Entry
            </ButtonUI>
          </div>
        )}
        <div className='mt-5'>
          {formData.status === "Approved" && (
            <ButtonUI
              color="primary"
              onClick={() => {
                navigate("/user/matched-entries", { state: { entry_id: formData.entry_id } })
              }}
            >
              View Potential Matches
            </ButtonUI>
          )}
        </div>

        {formData.status == "Pending Claim" && (
          <div className='flex flex-row gap-10'>
            <ButtonUI variant="solid" color="neutral"
              onClick={() => navigate("/user/lost-entries")}>
              Go Back
            </ButtonUI>
            <ButtonUI onClick={() => navigate("/user/matched-found", { state: { entry_id: formData.entry_id } })}>
              View Claimed Match
            </ButtonUI>
          </div>
        )}

      </div>

      <MessageBox
        show={showDeleteConfirm}
        message="Are you sure you want to delete this entry?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}
