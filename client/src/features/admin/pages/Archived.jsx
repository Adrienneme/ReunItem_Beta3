import React , { useState, useEffect } from 'react'
import AdminNavBar from '../../../components/layout/AdminNavBar'
import Card2 from '../../../components/ui/Card2'
import FilterDropdown from '../../../components/ui/Filters'
import { archived_items } from '../../../api/admin'

function LostFoundRep() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await archived_items(); 
        console.log("Archived Items Data:", data);

        // Safely combine items from lost and found groups
        const lostClaimed = data.lost_grouped?.Claimed || [];
        const lostRejected = data.lost_grouped?.Rejected || [];
        const foundClaimed = data.found_grouped?.Claimed || [];
        const foundRejected = data.found_grouped?.Rejected || [];

        const combined = [...lostClaimed, ...lostRejected, ...foundClaimed, ...foundRejected];

        console.log("Combined Entries:", combined);
        setEntries(combined);
      } catch (error) {
        console.error("Error fetching archived items:", error);
        alert("Failed to load items.");
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  // Filter entries by status
  const filteredEntries =
    filter === "All"
      ? entries
      : entries.filter((item) => item.status === filter);

  return (
    <div className="mb-6">
      <AdminNavBar />

      {/* Filter Dropdown */}
      <div className="flex flex-wrap justify-center mt-10">
        <FilterDropdown
          label="Filter"
          options={["All", "Claimed", "Rejected"]}
          value={filter}
          onChange={setFilter}
        />
      </div>

      {/* Loading or Empty States */}
      {loading ? (
        <p className="text-center mt-10 text-gray-500">Loading items...</p>
      ) : filteredEntries.length === 0 ? (
        <p className="text-center mt-10 text-gray-500">No items found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-10 mt-10">
          {filteredEntries.map((item, index) => (
            <Card2
              key={item.entry_id || item.id || index} // fallback to index if missing
              name={item.item_name || "Unnamed Item"}
              imageUrl={item.photo_url || "/placeholder.png"} // fallback image
              status={item.status || "Unknown"}
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
