import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import UserNavBar from '../../../../components/layout/UserNavBar';
import FoundBaseForm from '../../../../components/forms/FoundBaseForm';
import ButtonUI from '../../../../components/ui/ButtonUI';
import MessageBox from '../../../../components/ui/MessageBox';
import { useFetchItem } from '../../../../hooks/useFetch';
import { usematchItems } from '../../../../hooks/useMatch';
import CircularLoad from '../../../../components/ui/CircularLoad';
import { getUser } from '../../../../api/users';

export default function MatchedDetails() {
  const location = useLocation();
  const matchMutation = usematchItems();
  const navigate = useNavigate();

  const [showClaimConfirm, setShowClaimConfirm] = useState(false);
  const { entry_id: foundentry_id, lostentry_id, similarity } = location.state
  const { formData, user, isPending, error } = useFetchItem("found", foundentry_id);

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
    );
  }

  const handleClaim = () => { setShowClaimConfirm(true) };
  const cancelClaim = () => { setShowClaimConfirm(false) };

  const confirmClaim = () => {
    matchMutation.mutate({
      lostentry_id: lostentry_id,
      foundentry_id: foundentry_id,
      similarity: similarity
    },
      {
        onSuccess: () => setShowClaimConfirm(false),
        onError: () => setShowClaimConfirm(false),
      }
    )
  }

  return (
    <div className='mb-10'>
      <UserNavBar />
      <FoundBaseForm
        title="Found Item Details"
        formData={formData}
        percentage={similarity}
        existingPhoto={formData.photo_url}
        disabled={true}
        user={user}
      />
      <div className='flex flex-row justify-center mt-5 gap-10'>
        <ButtonUI variant="solid" color="neutral"
          onClick={() => navigate("/user/matched-entries", { state: { entry_id: lostentry_id } })}>
          Go Back
        </ButtonUI>
        <ButtonUI variant="solid" color="success"
          onClick={handleClaim}
          disabled={matchMutation.isLoading}
        >
          Claim this Item?
        </ButtonUI>
      </div>

      <MessageBox
        show={showClaimConfirm}
        message="Are you sure you want to Claim this item?"
        onConfirm={confirmClaim}
        confirmColor="bg-green-600 hover:bg-green-600 text-white"
        onCancel={cancelClaim}
      />
    </div>
  )
}
