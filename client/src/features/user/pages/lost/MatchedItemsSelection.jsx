import React, { useEffect, useState } from 'react'
import UserNavBar from '../../../../components/layout/UserNavBar'
import Card from '../../../../components/ui/Cards'
import { useFetchMatches } from '../../../../hooks/useFetch'
import { useLocation } from 'react-router-dom'

export default function MatchedItemsSelection() {
  const location = useLocation();
  const {entry_id} = location.state
  const {formData: entries = [], isPending, error} = useFetchMatches(entry_id)

  if (isPending || error) {
    return (
      <div>
        <UserNavBar />
        <div className="min-h-screen flex justify-center mt-50 text-gray-600 text-lg">
          {isPending ? "Loading Potential Matches..." : error.message}
        </div>
      </div>
    )
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
          {!entries || entries.length === 0 && (
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
              linkTo="/user/matched-details"
              stateData={{...item, lostentry_id: entry_id}}
            />
          ))}
      </div>
    </div>
  )
}
