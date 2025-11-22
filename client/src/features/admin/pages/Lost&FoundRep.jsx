import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import AdminNavBar from "../../../components/layout/AdminNavBar";
import Cards2 from "../../../components/ui/Card2";
import CircularLoad from "../../../components/ui/CircularLoad";
import FilterDropdown from "../../../components/ui/Filters";

import { admin_items } from "../../../api/admin";

function LostFoundRep() {
  const [filter, setFilter] = useState("All");

  const { data, isPending, error } = useQuery({
    queryKey: ["adminItems"],
    queryFn: admin_items,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const combined =
    data
      ? [
          ...(data.lost_grouped?.Approved || []),
          ...(data.lost_grouped?.Matched || []),
          ...(data.found_grouped?.Approved || []),
          ...(data.found_grouped?.Matched || []),
        ]
      : [];

  const filteredEntries = combined.filter((item) => {
    if (filter === "All") return true;
    return item.type === filter.toLowerCase();
  });

  if (isPending) {
    return (
      <div className="mb-6">
        <AdminNavBar />
        <div className="flex flex-col items-center gap-5 mt-20">
          <span>Loading Entries...</span>
          <CircularLoad />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6">
        <AdminNavBar />
        <p className="text-center mt-30 text-red-500">
          {error.response?.data?.detail || "Failed to load items."}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <AdminNavBar />

      <div className="flex flex-wrap justify-center mt-10">
        <FilterDropdown
          label="Filter"
          options={["All", "Lost", "Found"]}
          value={filter}
          onChange={setFilter}
        />
      </div>

      {filteredEntries.length === 0 ? (
        <p className="text-center mt-30 text-gray-500">No items found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-10 mt-10">
          {filteredEntries.map((item) => {
            const type = item.type?.toLowerCase();
            const linkTo =
              type === "lost"
                ? "/admin/lostentryadmin"
                : "/admin/foundentryadmin";

            return (
              <Cards2
                key={item.entry_id}
                name={item.item_name}
                imageUrl={item.photo_url}
                label={item.type}
                linkTo={linkTo}
                stateData={item}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LostFoundRep;
