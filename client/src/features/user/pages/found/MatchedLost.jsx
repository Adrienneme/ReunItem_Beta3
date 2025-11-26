import React from 'react'
import UserNavBar from '../../../../components/layout/UserNavBar'
import LostBaseForm from '../../../../components/forms/LostBaseForm'
import ButtonUI from '../../../../components/ui/ButtonUI';
import { useFetchItem, useFetchMatched } from '../../../../hooks/useFetch';
import { useLocation, useNavigate } from 'react-router-dom';
import CircularLoad from '../../../../components/ui/CircularLoad';

export default function MatchedLost() {
  const location = useLocation();
  const navigate = useNavigate();

  const entry_id = location.state?.entry_id;

  const { data, isPending: matchedPending } = useFetchMatched(entry_id);
  const lostentryId = data?.lost_entry_id;

  const { formData, user, isPending: itemPending, error } = useFetchItem("lost", lostentryId, {
    enabled: !!lostentryId
  });

  if (matchedPending || (lostentryId && itemPending)) {
    return (
      <div>
        <UserNavBar />
        <div className="mt-35 flex justify-center items-center text-gray-600 text-lg">
          <div className='flex flex-col items-center gap-5'>
            <span>Retrieving Matched Lost Item</span>
            <CircularLoad />
          </div>
        </div>
      </div>
    );
  }

  if (!lostentryId && !matchedPending) {
    return (
      <div>
        <UserNavBar />
        <div className='flex flex-col items-center gap-5 mt-35'>
          <span className='text-red-600'>No Matched Item</span>
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

  return (
    <div className='mb-10'>
      <UserNavBar />
      <LostBaseForm
        title="Matched Lost Item Details:"
        percentage={data.similarity}
        formData={formData}
        disabled={true}
        existingPhoto={formData.photo_url}
        user={user}
      />
      <div className='flex flex-row justify-center mt-5 gap-10'>
        <ButtonUI variant="solid" color="neutral"
          onClick={() => navigate("/user/found-details", { state: { entry_id: entry_id } })}>
          Go Back
        </ButtonUI>
      </div>
    </div>
  )
}
