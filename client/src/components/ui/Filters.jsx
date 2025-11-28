import React, { useState } from "react";

const Filter = ({ label = "Filter", options = [], onChange }) => {
  const [selected, setSelected] = useState(options[0] || "");

  const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={label} className="text-white-700 font-medium">
        {label}:
      </label>

      <select
        id={label}
        value={selected}
        onChange={handleChange}
        className="border border-gray-400 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-black-50  bg-gray-900 text-white"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

    </div>
  );
};

export default Filter;