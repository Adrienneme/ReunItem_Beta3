import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import UserNavBar from '../../../../components/layout/UserNavBar';
import FoundBaseForm from '../../../../components/forms/FoundBaseForm';
import ButtonUI from '../../../../components/ui/ButtonUI';
import MessageBox from '../../../../components/ui/MessageBox';
import { useFetchItem } from '../../../../hooks/useFetch';
import { usematchItems } from '../../../../hooks/useMatch';

export default function MatchedDetails() {
  const location = useLocation();
  const matchMutation = usematchItems();
  const { entry_id: foundentry_id, lostentry_id, similarity } = location.state
  const [showClaimConfirm, setShowClaimConfirm] = useState(false);
  const { formData, isPending, error } = useFetchItem("found", foundentry_id);

  if (isPending || error) {
    return (
      <div>
        <UserNavBar />
        <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
          {isPending ? "Loading Entry Detail..." : error.message}
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
      />
      <div className='flex flex-row justify-center mt-5 gap-10'>
        <ButtonUI variant="solid" color="neutral" onClick={() => navigate("/user/lost-entries")}>
          Go Back
        </ButtonUI>
        <ButtonUI variant="solid" color="success" onClick={handleClaim}
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
