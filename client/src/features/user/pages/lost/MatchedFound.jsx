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

  const cancelMutation = useCancelClaim("lost");

  const entry_id = location.state?.entry_id;

  const { data, isPending: matchedPending } = useFetchMatched(entry_id);
  const foundEntryId = data?.found_entry_id;

  const { formData, user, isPending: itemPending } = useFetchItem(
    "found",
    foundEntryId,
    { enabled: !!foundEntryId }
  );

  if (matchedPending || (foundEntryId && itemPending)) {
    return (
      <div>
        <UserNavBar />
        <div className="mt-35 flex justify-center items-center text-gray-600 text-lg">
          <div className='flex flex-col items-center gap-5'>
            <span>Retrieving Matched Found Item</span>
            <CircularLoad />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <UserNavBar />
        <div className="mt-35 flex justify-center text-gray-600 text-lg">
          <span className='text-red-600'>{error.message}</span>
        </div>
      </div>
    );
  }

  if (!foundEntryId && !matchedPending) {
    return (
      <div>
        <UserNavBar />
        <div className='flex flex-col items-center gap-5 mt-35'>
          <span className='text-red-600'>No Matched Item</span>
        </div>
      </div>
    );
  }

  const cancelCancel = () => setShowCancelConfirm(false);
  const confirmCancel = () => cancelMutation.mutate(entry_id);

  return (
    <div className='mb-10'>
      <UserNavBar />

      <FoundBaseForm
        title="Matched Found Item Details:"
        percentage={data.similarity}
        formData={formData}
        disabled={true}
        existingPhoto={formData?.photo_url}
        user={user}
      />

      <div className='flex flex-row justify-center mt-5 gap-10'>
        <ButtonUI
          variant="solid"
          color="neutral"
          onClick={() => navigate("/user/lost-details", { state: { entry_id } })}
        >
          Go Back
        </ButtonUI>

        {formData?.status === "Pending Claim" && (
          <ButtonUI
            variant="solid"
            color="danger"
            onClick={() => setShowCancelConfirm(true)}
          >
            Cancel Claim Request
          </ButtonUI>
        )}
      </div>

      <MessageBox
        show={showCancelConfirm}
        message="Are you sure you want to Cancel claimed Item?"
        onConfirm={confirmCancel}
        onCancel={cancelCancel}
      />
    </div>
  );
}
