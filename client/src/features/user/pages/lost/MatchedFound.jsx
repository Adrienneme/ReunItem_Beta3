import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFetchItem, useFetchMatched } from '../../../../hooks/useFetch';
import UserNavBar from '../../../../components/layout/UserNavBar';
import FoundBaseForm from '../../../../components/forms/FoundBaseForm';
import ButtonUI from '../../../../components/ui/ButtonUI';
import MessageBox from '../../../../components/ui/MessageBox';
import { useCancelClaim } from '../../../../hooks/useEdit';
import CircularLoad from '../../../../components/ui/CircularLoad';

export default function MatchedFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const cancelMutation = useCancelClaim("lost")
  const { entry_id } = location.state;
  const { data } = useFetchMatched(entry_id);
  const foundEntryId = data?.found_entry_id;
  const { formData, user, isPending, error } = useFetchItem("found", foundEntryId, {
    enabled: !!foundEntryId
  });
  

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

  const cancelCancel = () => {
    setShowCancelConfirm(false);
  };

  const confirmCancel = () => {
    cancelMutation.mutate(entry_id)
  }

  return (
    <div className='mb-10'>
      <UserNavBar />
      <FoundBaseForm
        title="Matched Found Item Details:"
        percentage={data.similarity}
        formData={formData}
        disabled={true}
        existingPhoto={formData.photo_url}
        user={user}
      />
      <div className='flex flex-row justify-center mt-5 gap-10'>
        <ButtonUI variant="solid" color="neutral"
          onClick={() => navigate("/user/lost-details", { state: { entry_id: entry_id } })}>
          Go Back
        </ButtonUI>
        <ButtonUI variant="solid" color="danger"
          onClick={() => { setShowCancelConfirm(true) }}
        >
          Cancel Claim Request
        </ButtonUI>
      </div>
      <MessageBox
        show={showCancelConfirm}
        message="Are you sure you want to Cancel claimed Item?"
        onConfirm={confirmCancel}
        onCancel={cancelCancel}
      />
    </div>
  )
}
