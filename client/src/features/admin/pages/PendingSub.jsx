
//Test function backend, update backend Pending status and approve entry working
import React, { useState, useEffect } from 'react'
import UserNavBar from '../../../components/layout/UserNavBar'
import Card from '../../../components/ui/Cards'
import FilterDropdown from '../../../components/ui/Filters'
import { getPendingItems } from '../../../api/admin'

function Pendingsub() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true); //added######

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        //const response = await getPendingItems(); // API call to fetch entries
        //setEntries(response); // Store response in state
        const data = await getPendingItems(); // now returns data only
        setEntries(data);
        console.log(response);
      } catch (error) {
        const errMsg = error.response?.data?.detail || "No Pending Entries.";
        console.error(error);
        alert(errMsg); 
      } finally {
        setLoading(false); 
      }
    };

    fetchEntries();
  }, []);

 

  //
  return (
    <div>
      <UserNavBar />
      {/* Filter Dropdown */}
      <div className="flex flex-wrap justify-center mt-10">
        <FilterDropdown
          label="Filter "
          options={["All", "Lost", "Found"]}
        />
      </div>

      {/* Modified*/}
      {/* Card Item */}
     
      <div className="flex flex-wrap justify-center gap-10 mt-10">
        {entries.map((item) => (
          <div key={item.entry_id} className="flex flex-col items-center">
            <Card
              name={item.item_name}         // Item name displayed on the card
              imageUrl={item.photo_url}     // Item image
              status={item.type}          // Current status of the item
              linkTo="/admin/foundcardview" // Navigation link to detail page
              stateData={item}              // Pass full item data for detail page
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Pendingsub

