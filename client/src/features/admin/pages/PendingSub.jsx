import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";
import AdminNavBar from "../../../components/layout/AdminNavBar";
import Card2 from "../../../components/ui/Card2";
import FilterDropdown from "../../../components/ui/Filters";
import CircularLoad from "../../../components/ui/CircularLoad";
import DateRangeFilter from "../../../components/ui/DateRangeFilter";
import dayjs from "dayjs";

import { getPendingItems } from "../../../api/admin";

function Pendingsub() {
  const [filter, setFilter] = React.useState("All");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

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

  const filteredEntries = entries?.filter((item) =>
    filter === "All" ? true : item.type === filter
  )
    .filter((item) => {
      const { startDate, endDate } = dateRange;

      if (!startDate || !endDate) return true;

      const itemDate = dayjs(item.created_at);

      return (
        itemDate.isAfter(startDate.startOf("day")) &&
        itemDate.isBefore(endDate.endOf("day"))
      );
    });

  return (
    <div className="mb-6">
      <AdminNavBar />
      <div className="flex flex-col ml-20 mt-10 mb-5">
        <div className="flex flex-row gap-3">
          <ClipboardList className="w-8 h-8 mb-2" />
          <h1 className="text-2xl font-bold mb-5">Pending Item Reports</h1>
        </div>
        <p className="mb-5">
          <b>Review item submissions awaiting approval.</b><br></br>
          Admins can review, approve, or reject reports submitted by users. Use this page to verify item details and keep your system accurate and up-to-date.
        </p>
        <div>
          <h1 className='mb-3'><b>Filter by</b></h1>
          <div className="flex flex-row items-center gap-10">
            <FilterDropdown
              label="Type"
              options={["All", "lost", "found"]}
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



      {filteredEntries?.length === 0 ? (
        <p className="text-center mt-30 text-gray-500">
          No pending items found.
        </p>
      ) : (
        <div className="flex flex-wrap justify-center gap-10 mt-10">
          {filteredEntries?.map((item) => {
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
