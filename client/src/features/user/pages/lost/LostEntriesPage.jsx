import React from 'react'
import UserNavBar from '../../../../components/layout/UserNavBar'
import FilterDropdown from '../../../../components/ui/Filters'
import Card from '../../../../components/ui/Cards'
import { useFetchItems } from '../../../../hooks/useFetch'
import CircularLoad from '../../../../components/ui/CircularLoad'

export default function LostEntriesPage() {

  const { entries, isPending, error } = useFetchItems("lost", "lost_items");

  if (isPending || error) {
    return (
      <div>
        <UserNavBar />
        <div className="min-h-screen flex justify-center mt-50 text-gray-600 text-lg">
          {isPending ?
            <div className='flex flex-col items-center gap-5'>
              <span>Loading Lost Entries...</span>
              <CircularLoad />
            </div> : error.message}
        </div>
      </div>
    )
  }

  return (
    <div className='mb-10'>
      <UserNavBar />
      <div className="flex flex-col items-center">
        <div className="mt-5 mb-5">
          <h1 className="text-xl font-bold">Lost Entries:</h1>
        </div>

        <FilterDropdown
          options={[
            "All",
            "Pending Approval",
            "Pending Claim",
            "Approved",
            "Rejected",
            "Claimed",
            "Archived"
          ]}
        />

        <div className="flex flex-wrap justify-center gap-10 mt-10">
          {entries
            .filter((item) => item.type === "lost")
            .map((item) => (
              <Card
                key={item.entry_id}
                name={item.item_name}
                imageUrl={item.photo_url}
                status={item.status}
                linkTo="/user/lost-details"
                stateData={item}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
