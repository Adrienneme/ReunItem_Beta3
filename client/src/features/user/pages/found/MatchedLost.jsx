import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LostBaseForm from '../../../../components/forms/LostBaseForm';
import { getItem } from '../../../../api/items';
import UserNavBar from '../../../../components/layout/UserNavBar';
import ButtonUI from '../../../../components/ui/ButtonUI';


export default function MatchedLost() {
  const lostentry_Id = localStorage.getItem("entry_id");
  const foundentry_id = localStorage.getItem("foundentry_id")
  const similarity = Number(localStorage.getItem("similarity"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entry, setEntry] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchEntry = async () => {
      try {
        const response = await getItem(lostentry_Id);
        if (isMounted) setEntry(response);
        console.log(response)
      } catch (error) {
        if (isMounted) setError("No Entry Found.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchEntry();
    return () => { isMounted = false; };
  }, []);


  if (loading) {
    return (
      <div>
        <UserNavBar />
        <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
          Loading entry details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <UserNavBar />
        <div className="min-h-screen flex justify-center items-center text-red-600 text-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className='mb-10'>
      <UserNavBar />

      <div className="flex flex-col items-center justify-center mx-5">
        <LostBaseForm
          title="Lost Item Detail:"
          percentage={similarity}
          existingPhoto={entry.photo_url}
          formData={entry}
          disabled={true}
        />

        {entry.status == "Pending Claim" && (
          <>
            <div className='mt-10'>
              <ButtonUI variant="solid" color="neutral" onClick={() => {
                navigate("/user/found-entries-detail")
                localStorage.setItem("entry_id", foundentry_id)
              }}>
                Go Back
              </ButtonUI>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
