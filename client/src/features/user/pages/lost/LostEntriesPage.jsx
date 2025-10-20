import React from 'react'
import UserNavBar from '../../../../components/layout/UserNavBar'
import FilterDropdown from '../../../../components/ui/Filters'
import Card from '../../../../components/ui/Cards'

export default function LostEntriesPage() {
  return (
    <div>
      <UserNavBar />
      <div className='flex flex-col items-center'>

        <div className='mt-5 mb-5'>
          <h1 className='text-xl font-bold'>Lost Entries:</h1>
        </div>

        <FilterDropdown
          options={["All", "Pending Approval", "Pending Claim", "Approved",
            "Rejected", "Claimed", "Matched", "Archived"
          ]} />

        <div className="flex flex-wrap justify-center gap-10 mt-10">
          <Card label="" status="Pending Approval" />
          <Card label="" status="Pending Approval" />
          <Card label="" status="Pending Approval" />
          <Card label="" status="Pending Approval" />
          
        </div>

      </div>
    </div>
  )
}
