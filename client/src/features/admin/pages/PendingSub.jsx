//Test function backend, update backend Pending status and approve entry working
import React, { useState, useEffect } from 'react'
import AdminNavBar from '../../../components/layout/AdminNavBar'
import Card2 from '../../../components/ui/Card2'
import FilterDropdown from '../../../components/ui/Filters'
import { getPendingItems } from '../../../api/admin'

function Pendingsub() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await getPendingItems(filter);
      setEntries(data);
      console.log("Pending Items:", data);
    } catch (error) {
      const errMsg = error.response?.data?.detail || "No Pending Entries.";
      console.error(error);
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [filter]);

  return (
    <div className="mb-6">
      <AdminNavBar />
      {/* Filter Dropdown */}
      <div className="flex flex-wrap justify-center mt-10">
        <FilterDropdown
          label="Filter"
          options={["All", "Lost", "Found"]}
          value={filter}
          onChange={setFilter}
        />
      </div>

      {/* Cards Section */}
      {loading ? (
        <p className="text-center mt-10">Loading...</p>
      ) : entries.length === 0 ? (
        <p className="text-center mt-10 text-gray-500">No pending items found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-10 mt-10">
          {entries.map((item) => (
            <Card2
              key={item.entry_id}
              name={item.item_name}
              imageUrl={item.photo_url}
              label={item.type}
              linkTo="/admin/foundcardview"
              stateData={item}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Pendingsub;
