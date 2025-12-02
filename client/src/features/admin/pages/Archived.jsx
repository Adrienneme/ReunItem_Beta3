import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Archive } from "lucide-react";

import AdminNavBar from "../../../components/layout/AdminNavBar";
import Card2 from "../../../components/ui/Card2";
import FilterDropdown from "../../../components/ui/Filters";
import CircularLoad from "../../../components/ui/CircularLoad";
import DateRangeFilter from "../../../components/ui/DateRangeFilter";
import dayjs from "dayjs";

import { archived_items } from "../../../api/admin";

function LostFoundRep() {
  const [filter, setFilter] = useState("All");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const { data, isPending, error } = useQuery({
    queryKey: ["archivedItems"],
    queryFn: archived_items,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const combined = data
    ? [
        ...(data.lost_grouped?.Claimed || []),
        ...(data.lost_grouped?.Rejected || []),
        ...(data.found_grouped?.Claimed || []),
        ...(data.found_grouped?.Rejected || []),
      ]
    : [];

  const filteredEntries = combined
    .filter((item) => {
      if (filter === "All") return true;
      return item.status === filter;
    })
    .filter((item) => {
      const { startDate, endDate } = dateRange;

      if (!startDate || !endDate) return true;

      const itemDate = dayjs(item.created_at);

      return (
        itemDate.isAfter(startDate.startOf("day")) &&
        itemDate.isBefore(endDate.endOf("day"))
      );
    });

  if (isPending || error) {
    return (
      <div>
        <AdminNavBar />
        <div className="min-h-screen flex justify-center mt-35 text-gray-600 text-lg">
          {isPending ? (
            <div className="flex flex-col items-center gap-5">
              <span>Loading Item Entries</span>
              <CircularLoad />
            </div>
          ) : (
            error.response?.data?.detail || "No Item Entries Yet"
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <AdminNavBar />
      <div className="flex flex-col items-center mt-10 mb-5">
        <div className="flex flex-row gap-3">
          <Archive className="w-8 h-8 mb-2" />
        <h1 className="text-xl font-bold mb-5">Archived Item Entries</h1>
        </div>
        <div>
          <h1 className='mb-3'><b>Filter by</b></h1>
          <div className="flex flex-row items-center gap-10">
            <FilterDropdown
            label="Type"
            options={["All", "Lost", "Found"]}
            value={filter}
            onChange={setFilter}
          />
          <div className='flex flex-row gap-3 items-center'>
            <h1>Timeline:</h1>
            <DateRangeFilter
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={setDateRange}
            />
          </div>
          </div>
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <p className="text-center mt-30 text-gray-500">No items found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-10 mt-10">
          {filteredEntries.map((item) => {
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

export default LostFoundRep;
