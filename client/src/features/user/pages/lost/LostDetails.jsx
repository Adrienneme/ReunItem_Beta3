import React from 'react'
import UserNavBar from '../../../../components/layout/UserNavBar'
import LostBaseForm from '../../../../components/forms/LostBaseForm';
import ButtonUI from '../../../../components/ui/ButtonUI'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFetchItem } from '../../../../hooks/useFetch';


export default function LostDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { entry_id } = location.state;

  const { formData, isPending, error } = useFetchItem("lost", entry_id);

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
      <LostBaseForm
        title="Lost Item Details:"
        status={formData.status}
        formData={formData}
        disabled={true}
        existingPhoto={formData.photo_url}
      />
      <div className='flex flex-row items-center justify-center mt-5'>
        <ButtonUI variant="solid" color="neutral" onClick={() => navigate("/user/lost-entries")}>
          Go Back
        </ButtonUI>
      </div>
    </div>
  )
}
