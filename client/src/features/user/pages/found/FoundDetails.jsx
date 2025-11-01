import React from 'react'
import UserNavBar from '../../../../components/layout/UserNavBar'
import FoundBaseForm from '../../../../components/forms/FoundBaseForm'
import { useLocation } from 'react-router-dom'
import { useFetchItem } from '../../../../hooks/useFetch'

export default function FoundDetails() {
  const location = useLocation();
  const { entry_id } = location.state;

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
      <div>

      </div>
    </div>
  )
}
