
//Testing purpose: View all records except Rejected and Pending Approval
import React, { useState, useEffect } from 'react';
import UserNavBar from '../../../components/layout/UserNavBar';
import Card from '../../../components/ui/Cards';
import FilterDropdown from '../../../components/ui/Filters';
import { admin_items } from '../../../api/admin'; 

function LostFoundRep() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await admin_items(); 
        console.log("Fetched Lost/Found Items:", data);

        // Combine both lost and found items into one array
        const combined = [
          ...(data.lost_grouped?.Approved || []),
          ...(data.lost_grouped?.Matched || []),
          ...(data.found_grouped?.Approved || []),
          ...(data.found_grouped?.Matched || [])
        ];

        setEntries(combined);
      } catch (error) {
        const errMsg = error.response?.data?.detail || "Failed to load items.";
        console.error("Error fetching items:", error);
        alert(errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  //filtering by status
  const filteredEntries =
    filter === "All"
      ? entries
      : entries.filter((item) => item.status === filter);

  return (
    <div>
      <UserNavBar />

      {/* Filter Dropdown */}
      <div className="flex flex-wrap justify-center mt-10">
        <FilterDropdown
          label="Filter"
          options={["All", "Approved", "Matched"]}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <p className="text-center mt-10 text-gray-500">Loading items...</p>
      ) : filteredEntries.length === 0 ? (
        <p className="text-center mt-10 text-gray-500">No items found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-10 mt-10">
          {filteredEntries.map((item) => (
            <Card
              key={item.entry_id}
              name={item.item_name}
              imageUrl={item.photo_url}
              status={item.status}
              linkTo="/admin/foundcardview"
              stateData={item}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default LostFoundRep;
