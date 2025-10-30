
//Test function backend, update backend Pending status and approve entry working
import React, { useState, useEffect } from 'react'
import UserNavBar from '../../../components/layout/UserNavBar'
import Card from '../../../components/ui/Cards'
import FilterDropdown from '../../../components/ui/Filters'
import { getPendingItems } from '../../../api/admin'

function Pendingsub() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All"); // Track selected filter

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true); // Start loading
        const data = await getPendingItems(filter); // Pass filter to API
        setEntries(data);
        console.log(data); // Corrected console log
      } catch (error) {
        const errMsg = error.response?.data?.detail || "No Pending Entries.";
        console.error(error);
        alert(errMsg);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchEntries();
  }, [filter]); // Refetch when filter changes

  return (
    <div>
      <UserNavBar />

      {/* Filter Dropdown */}
      <div className="flex flex-wrap justify-center mt-10">
        <FilterDropdown
          label="Filter"
          options={["All", "Lost", "Found"]}
          value={filter}       // current selected value
          onChange={setFilter} // update filter on change
        />
      </div>

      {/* Card Item */}
      {loading ? (
        <p className="text-center mt-10">Loading...</p> // Loading indicator
      ) : (
        <div className="flex flex-wrap justify-center gap-10 mt-10">
          {entries.map((item) => (
            <div key={item.entry_id} className="flex flex-col items-center">
              <Card
                name={item.item_name}          // Item name
                imageUrl={item.photo_url}      // Item image
                status={item.status}           // Current status of the item
                linkTo="/admin/foundcardview" // Navigation link
                stateData={item}               // Pass full item data
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Pendingsub