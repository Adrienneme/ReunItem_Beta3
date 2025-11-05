import React , { useState, useEffect } from 'react'
import AdminNavBar from '../../../components/layout/AdminNavBar'
import Card from '../../../components/ui/Cards'
import FilterDropdown from '../../../components/ui/Filters'
import { getPendingItems } from '../../../api/admin'

const Archived = () => {
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
          alert(errMsg); // Show user-friendly error
        } finally {
          setLoading(false); // Stop loading indicator
        }
      };
  
      fetchEntries();
    }, []);
  return (
    <div>
     <AdminNavBar />
     {/* Filter Dropdown */}
           <div className="flex flex-wrap justify-center mt-10">
             <FilterDropdown 
              label="Filter "
              options={["All", "Returned", "Discarded", "Donated"]}
             />
           </div>

     {/* Card Item */}
     <div className="flex flex-wrap justify-center gap-10 mt-10">
         {entries
          .map((item) => (
            <Card
              key={item.entry_id}           // Unique key for list rendering
              name={item.item_name}         // Item name displayed on the card
              imageUrl={item.photo_url}     // Item image
              status={item.status}          // Current status of the item
              linkTo="/admin/foundcardview" // Navigation link to detail page
              stateData={item}              // Pass full item data for detail page
            />
          ))}

      </div>
    </div>
  )
}

export default Archived