import React, { useState } from "react";

const FilterDropdown = () => {
  const [filter, setFilter] = useState("All");

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="filter" className="text-white-700 font-medium">
        Filter:
      </label>

      <select
        id="filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border border-gray-400 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-black-500 text-black bg-white"
      >
        <option value="All">All</option>
        <option value="Returned">Returned</option>
        <option value="Discarded">Discarded</option>
        <option value="Donated">Donated</option>
      </select>

    </div>
  );
};

export default FilterDropdown;