import React from 'react'
import { useState, useEffect } from 'react'
import UserNavBar from '../../../../components/layout/UserNavBar'
import FilterDropdown from '../../../../components/ui/Filters'
import Card from '../../../../components/ui/Cards'
import { getItems } from '../../../../api/items'

/**
 * FoundEntriesPage
 *
 * This component displays a list of "found" item entries retrieved from the backend API.
 * It includes a navigation bar, a filter dropdown, and cards for each found entry.
 *
 * Features:
 * - Fetches entries from the backend on mount
 * - Displays loading state while fetching
 * - Filters entries to show only "found" items
 * - Provides a dropdown to potentially filter by status (UI only)
 *
 * @component
 * @returns {JSX.Element} Rendered FoundEntriesPage component
 */
export default function FoundEntriesPage() {
  // State to store the fetched entries
  const [entries, setEntries] = useState([]);
  // State to track loading status
  const [loading, setLoading] = useState(true);

  /**
   * Fetches entries from the backend API
   * Only runs once when the component mounts
   */
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await getItems(); // API call to fetch entries
        setEntries(response); // Store response in state
        console.log(response);
      } catch (error) {
        const errMsg = error.response?.data?.detail || "No entries yet.";
        console.error(error);
        alert(errMsg); // Show user-friendly error
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchEntries();
  }, []);

  // Display loading screen while fetching data
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
        Loading entries...
      </div>
    );
  }

  return (
    <div>
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
                linkTo="/user/found-entries-detail" // Navigation link to detail page
                stateData={item}              // Pass full item data for detail page
              />
            ))}
        </div>
      </div>
    </div>
  );
}
