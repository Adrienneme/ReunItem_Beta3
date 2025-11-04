import React from 'react'
import UserNavBar from '../../../../components/layout/UserNavBar'
import FoundBaseForm from '../../../../components/forms/FoundBaseForm'
import ButtonUI from '../../../../components/ui/ButtonUI'
import MessageBox from '../../../../components/ui/MessageBox'
import { useState } from 'react'
import { useDeleteItem } from '../../../../hooks/useEdit'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFetchItem } from '../../../../hooks/useFetch'

export default function FoundDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { entry_id } = location.state;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeleteItem("found")
  const { formData, isPending, error } = useFetchItem("found", entry_id);

  if (isPending || error) {
    return (
      <div>
        <UserNavBar />
        <div className="min-h-screen flex justify-center mt-50 text-gray-600 text-lg">
          {isPending ? "Loading Entry Detail..." : error.message}
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
      <FoundBaseForm
        title="Found Item Details:"
        status={formData.status}
        formData={formData}
        disabled={true}
        existingPhoto={formData.photo_url}
      />
      <div className='flex flex-row items-center justify-center mt-5'>
        {["Claimed", "Rejected", "Archived"].includes(formData.status) && (
          <div className='flex flex-row items-center justify-center mt-5 gap-5'>
            <ButtonUI variant="solid" color="neutral" onClick={() => navigate("/user/found-entries")}>
              Go Back
            </ButtonUI>
          </div>
        )}
        {["Pending Approval", "Approved"].includes(formData.status) && (
          <div className='flex flex-row items-center justify-center mt-5 gap-5'>
            <ButtonUI variant="solid" color="neutral" onClick={() => navigate("/user/found-entries")}>
              Go Back
            </ButtonUI>
            <ButtonUI variant="solid" color="danger"
              onClick={() => { setShowDeleteConfirm(true) }}
            >
              Delete Entry
            </ButtonUI>
            <ButtonUI variant="solid" color="warning"
              onClick={() => {
                navigate("/user/found-details-edit", { state: { formData } })
              }}>
              Edit Entry
            </ButtonUI>
          </div>
        )}

        {formData.status == "Pending Claim" && (
          <div className='flex flex-row gap-10'>
            <ButtonUI variant="solid" color="neutral"
              onClick={() => navigate("/user/found-entries")}>
              Go Back
            </ButtonUI>
            <ButtonUI onClick={() => navigate("/user/matched-lost", { state: { entry_id: formData.entry_id } })}>
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
