import React from 'react'
import { useState, useEffect } from 'react'
import UserNavBar from '../../../../components/layout/UserNavBar'
import FilterDropdown from '../../../../components/ui/Filters'
import Card from '../../../../components/ui/Cards'
import wallet from '../../../../assets/samples/wallet.jpg'

export default function FoundEntriesPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate API fetch
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        item_name: "Black Wallet",
        photo_url: wallet,
        label: "Found",
        status: "Pending Approval",
        description: "Black leather wallet found near gate 3.",
        pickup_location: "Gate 1"
      },
      {
        id: 2,
        item_name: "iPhone 12",
        photo_url: "https://images.unsplash.com/photo-1580910051073-d8a8c7f1e2b9?auto=format&fit=crop&w=400&q=60",
        status: "Approved",
        description: "Blue iPhone 12 found in the cafeteria.",
      },
      {
        id: 3,
        item_name: "Umbrella",
        photo_url: "https://images.unsplash.com/photo-1520975922091-a3bdb8b8be61?auto=format&fit=crop&w=400&q=60",
        status: "Claimed",
        description: "Foldable umbrella left in the library.",
      },
    ];

    // simulate loading delay
    setTimeout(() => {
      setEntries(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
        Loading entries...
      </div>
    );
  }


  return (
    <div>
      <UserNavBar />
      <div className='flex flex-col items-center'>

        <div className='mt-5 mb-5'>
          <h1 className='text-xl font-bold'>Found Entries:</h1>
        </div>

        <FilterDropdown
          options={["All", "Pending Approval", "Approved",
            "Rejected", "Claimed", "Archived"
          ]} />

        <div className="flex flex-wrap justify-center gap-10 mt-10">
          
          {entries.map((item) => (
            <Card
              key={item.id}
              name={item.item_name}
              imageUrl={item.photo_url}
              status={item.status}
              pickup_location={item.pickup_location}
              linkTo="/user/found-entries-detail"
              stateData={item} // 👈 pass entire item data
            />
          ))}

        </div>

      </div>
    </div>
  )
}
