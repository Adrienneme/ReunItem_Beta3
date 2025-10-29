import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FoundBaseForm from '../../../../components/forms/FoundBaseForm';
import { getItem, setMatch } from '../../../../api/items';
import UserNavBar from '../../../../components/layout/UserNavBar';
import ButtonUI from '../../../../components/ui/ButtonUI';
import MessageBox from '../../../../components/ui/MessageBox';


export default function MatchedItemDetail() {
  const foundentry_Id = localStorage.getItem("entry_id");
  const lostentry_Id = localStorage.getItem("lostentry_Id");
  const lostentry_id = localStorage.getItem("lostentry_id")
  const similarity = Number(localStorage.getItem("similarity"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entry, setEntry] = useState({});
  const [showClaimConfirm, setShowClaimConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchEntry = async () => {
      try {
        const response = await getItem(foundentry_Id);
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
  }, [foundentry_Id]);

  const confirmClaim = async () => {
    try {
      const response = await setMatch(lostentry_Id, foundentry_Id, similarity)
      console.log("Success", response)
      alert("Found Item Claimed!")
      localStorage.removeItem("lostentry_Id");
      localStorage.removeItem("similarity");
      navigate("/user/lost-entries");
    } catch (error) {
      const errMsg = error.response?.data?.detail || "Failed to Claim Entry.";
      console.log(error.response?.data.detail);
      alert(errMsg);
    } finally {
      setShowClaimConfirm(false);
    }

  }

  const handleClaim = () => {
    setShowClaimConfirm(true);
  };

  const cancelClaim = () => {
    setShowClaimConfirm(false);
  };

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
        <FoundBaseForm
          title="Found Item Detail:"
          percentage={similarity}
          existingPhoto={entry.photo_url}
          formData={entry}
          disabled={true}
        />

        {entry.status == "Pending Claim" && (
          <>
            <div className='mt-10'>
              <ButtonUI variant="solid" color="neutral" onClick={() => {
                navigate("/user/lost-entries-detail")
                localStorage.setItem("entry_id", lostentry_id)
              }}>
                Go Back
              </ButtonUI>
            </div>
          </>
        )}

        {entry.status == "Approved" && (
          <div className="flex flex-row items-center mt-10 gap-10">
            <ButtonUI variant="solid" color="neutral" onClick={() => navigate("/user/lost-entries")}>
              Go Back
            </ButtonUI>
            <ButtonUI variant="solid" color="success" onClick={handleClaim}>
              Claim this Item?
            </ButtonUI>
          </div>
        )}

        <MessageBox
          show={showClaimConfirm}
          message="Are you sure you want to Claim this item?"
          onConfirm={confirmClaim}
          confirmColor="bg-green-600 hover:bg-green-600 text-white"
          onCancel={cancelClaim}
        />
      </div>
    </div>
  )
}
