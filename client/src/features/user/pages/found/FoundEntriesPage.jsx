import React from 'react'
import UserNavBar from '../../../../components/layout/UserNavBar'
import FilterDropdown from '../../../../components/ui/Filters'
import Card from '../../../../components/ui/Cards'
import { useFetchItems } from '../../../../hooks/useFetch'
import CircularLoad from '../../../../components/ui/CircularLoad'

export default function FoundEntriesPage() {

  const { entries, isPending, error } = useFetchItems("found", "found_items");

  if (isPending || error) {
    return (
      <div>
        <UserNavBar />
        <div className="min-h-screen flex justify-center mt-50 text-gray-600 text-lg">
          {isPending ? 
          <div className='flex flex-col items-center gap-5'>
             <span>Loading Found Entries...</span>
             <CircularLoad/>
          </div> : error.message}
        </div>
      </div>
    )
  }

  return (
    <div className='mb-10'>
      {/* Navigation Bar */}
      <UserNavBar />

      <div className='flex flex-col items-center'>
        {/* Page Title */}
        <div className='mt-5 mb-5'>
          <h1 className='text-xl font-bold'>Found Entries:</h1>
        </div>

        {/* Filter Dropdown */}
        <FilterDropdown
          options={[
            "All",
            "Pending Approval",
            "Approved",
            "Rejected",
            "Claimed",
            "Archived"
          ]}
        />

        {/* Display Found Item Cards */}
        <div className="flex flex-wrap justify-center gap-10 mt-10">
          {entries
            .filter((item) => item.type === "found") // Only show found items
            .map((item) => (
              <Card
                key={item.entry_id}           // Unique key for list rendering
                name={item.item_name}         // Item name displayed on the card
                imageUrl={item.photo_url}     // Item image
                status={item.status}          // Current status of the item
                linkTo="/user/found-details" // Navigation link to detail page
                stateData={item}              // Pass full item data for detail page
              />
            ))}
        </div>
      </div>
    </div>
  );
}
