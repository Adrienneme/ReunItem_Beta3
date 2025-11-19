// View all records except Rejected and Pending Approval
import React, { useState, useEffect } from 'react';
import AdminNavBar from '../../../components/layout/AdminNavBar';
import Cards from '../../../components/ui/Cards';
import { admin_items } from '../../../api/admin';

function LostFoundRep() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="mb-6">
      <AdminNavBar />

      {/* Loading / Empty / Cards Display */}
      {loading ? (
        <p className="text-center mt-10 text-gray-500">Loading items...</p>
      ) : entries.length === 0 ? (
        <p className="text-center mt-10 text-gray-500">No items found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-10 mt-10">
          {entries.map((item) => (
            <Cards
              key={item.entry_id}
              name={item.item_name}
              imageUrl={item.photo_url}
              label={item.type}
              linkTo="/admin/foundentryadmin"
              stateData={item}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default LostFoundRep;
