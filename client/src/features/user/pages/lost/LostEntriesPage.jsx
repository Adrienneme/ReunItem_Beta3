import React from 'react'
import UserNavBar from '../../../../components/layout/UserNavBar'
import FilterDropdown from '../../../../components/ui/Filters'
import Card2 from '../../../../components/ui/Card2'
import { useFetchItems } from '../../../../hooks/useFetch'
import CircularLoad from '../../../../components/ui/CircularLoad'

export default function LostEntriesPage() {

  const { entries, isPending, error } = useFetchItems("lost", "lost_items");

  const [selectedStatus, setSelectedStatus] = React.useState("All");

  if (isPending || error) {
    return (
      <div>
        <UserNavBar />
        <div className="min-h-screen flex justify-center mt-35 text-gray-600 text-lg">
          {isPending ?
            <div className='flex flex-col items-center gap-5'>
              <span>Loading Lost Items</span>
              <CircularLoad />
            </div> : error.message}
        </div>
      </div>
    )
  }

  const filteredEntries = entries
    .filter((item) => item.type === "lost")
    .filter((item) =>
      selectedStatus === "All" ? true : item.status === selectedStatus
    );

  return (
    <div className='mb-10'>
      <UserNavBar />
      <div className="flex flex-col items-center">

        <div className="mt-5 mb-5">
          <h1 className="text-xl font-bold">Lost Items:</h1>
        </div>

        <FilterDropdown
          label="Status"
          options={[
            "All",
            "Pending Approval",
            "Pending Claim",
            "Approved",
            "Rejected",
            "Claimed"
          ]}
          onChange={(value) => setSelectedStatus(value)}
        />

        <div className="flex flex-wrap justify-center gap-10 mt-10">
          {filteredEntries.map((item) => (
            <Card2
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
