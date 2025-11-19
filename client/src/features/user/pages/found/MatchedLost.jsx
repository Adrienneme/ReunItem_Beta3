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
  const { entry_id } = location.state;
  const { data } = useFetchMatched(entry_id);
  const lostentryId = data?.lost_entry_id;
  const { formData, isPending, error } = useFetchItem("lost", lostentryId, {
    enabled: !!lostentryId
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

  return (
    <div className='mb-10'>
      <UserNavBar />
      <LostBaseForm
        title="Matched Lost Item Details:"
        percentage={data.similarity}
        formData={formData}
        disabled={true}
        existingPhoto={formData.photo_url}
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
