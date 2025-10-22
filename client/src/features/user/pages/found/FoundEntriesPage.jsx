import React from 'react'
import { useState, useEffect } from 'react'
import UserNavBar from '../../../../components/layout/UserNavBar'
import FilterDropdown from '../../../../components/ui/Filters'
import Card from '../../../../components/ui/Cards'
import { getItems } from '../../../../api/items'

export default function FoundEntriesPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await getItems()
        setEntries(response)
        console.log(response)
      } catch (error) {
        const errMsg = error.response?.data?.detail || "No entries yet."
        console.error(error)
        alert(errMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchEntries()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
        Loading entries...
      </div>
    )
  }


  return (
    <div>
      <UserNavBar />
      <div className='flex flex-col items-center'>

        <div className='mt-5 mb-5'>
          <h1 className='text-xl font-bold'>Found Entries:</h1>
        </div>

        <FilterDropdown
          options={[
            "All", 
            "Pending Approval", 
            "Approved",
            "Rejected", 
            "Claimed", 
            "Archived"
          ]} />

        <div className="flex flex-wrap justify-center gap-10 mt-10">

          {entries
            .filter((item) => item.type === "found")
            .map((item) => (
              <Card
                key={item.entry_id}
                name={item.item_name}
                imageUrl={item.photo_url}
                status={item.status}
                linkTo="/user/found-entries-detail"
                stateData={item}
              />
            ))}

        </div>

      </div>
    </div>
  )
}
