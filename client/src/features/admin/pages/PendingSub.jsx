import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import AdminNavBar from "../../../components/layout/AdminNavBar";
import Card2 from "../../../components/ui/Card2";
import FilterDropdown from "../../../components/ui/Filters";
import CircularLoad from "../../../components/ui/CircularLoad";

import { getPendingItems } from "../../../api/admin";

function Pendingsub() {
  const [filter, setFilter] = useState("All");

  const { data: entries, isPending, error } = useQuery({
    queryKey: ["pendingItems", filter],
    queryFn: () => getPendingItems(filter),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  if (isPending || error) {
    return (
      <div>
        <AdminNavBar />
        <div className="min-h-screen flex justify-center mt-35 text-gray-600 text-lg">
          {isPending ?
            <div className='flex flex-col items-center gap-5'>
              <span>Loading Item Entries</span>
              <CircularLoad />
            </div> : error.response?.data?.detail || "No Item Entries Yet"}
        </div>
      </div>
    )
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

      {entries?.length === 0 ? (
        <p className="text-center mt-30 text-gray-500">No pending items found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-10 mt-10">
          {entries?.map((item) => {
            const type = item.type?.toLowerCase();
            const linkTo =
              type === "lost"
                ? "/admin/lostcardview"
                : "/admin/foundcardview";

            return (
              <Card2
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

export default Pendingsub;
