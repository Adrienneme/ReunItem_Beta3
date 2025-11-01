import React, { useEffect, useState } from 'react'
import UserNavBar from '../../../../components/layout/UserNavBar'
import Card from '../../../../components/ui/Cards'
import { getMatches } from '../../../../api/items';

export default function MatchedItemsSelection() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const lostentry_id = localStorage.getItem("entry_id");
  localStorage.setItem("lostentry_Id", lostentry_id);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await getMatches(lostentry_id);
        setEntries(response);
        console.log(response);
      } catch (error) {
        const errMsg = error.response?.data?.detail || "No Found Matches yet :(";
        console.error(error);
        alert(errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  if (loading) {
    return (
      <div>
        <UserNavBar />
        <div className="min-h-screen flex justify-center mt-50 text-gray-600 text-lg">
          Loading Potential Matches...
        </div>
      </div>
    );
  }

  return (
    <div className='mb-10'>
      <UserNavBar />
      <div className="flex flex-col items-center">
        <div className="mt-5 mb-5">
          <h1 className="text-xl font-bold">Potential Matches:</h1>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-10 mt-10">
        <div>
          {entries.length === 0 && (
            <p className="text-gray-500 text-lg mt-20">No matched items found, Check again later...</p>
          )}
        </div>
        {entries
          .map((item) => (
            <Card
              key={item.entry_id}
              name={item.item_name}
              imageUrl={item.photo_url}
              percentage={item.similarity}
              linkTo="/user/matched-entry-detail"
              stateData={item}
            />
          ))}
      </div>
    </div>
  )
}
