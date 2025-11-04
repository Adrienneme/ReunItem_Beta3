import React from 'react'
import UserNavBar from '../../../../components/layout/UserNavBar'
import LostBaseForm from '../../../../components/forms/LostBaseForm'
import { useFetchItem, useFetchMatched } from '../../../../hooks/useFetch';
import { useLocation } from 'react-router-dom';

export default function MatchedLost() {
  const location = useLocation();
  const { entry_id } = location.state;
  const { data } = useFetchMatched(entry_id);
  const lostentryId = data?.found_entry_id;
  const { formData, isPending, error } = useFetchItem("lost", lostentryId, {
    enabled: !!lostentryId
  });

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

  return (
    <div>
      <UserNavBar />
      <LostBaseForm
        title="Matched Lost Item Details:"
        percentage={data.similarity}
        formData={formData}
        disabled={true}
        existingPhoto={formData.photo_url}
      />
    </div>
  )
}
