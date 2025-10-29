import React from "react";

const getPercentageColor = (pct) => {
  if (pct >= 80) return "bg-green-100 text-green-700";
  if (pct >= 60) return "bg-lime-100 text-lime-700";
  if (pct >= 40) return "bg-yellow-100 text-yellow-700";
  if (pct >= 20) return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
};

const PercentageBadge = ({ percentage }) => {
  if (percentage === undefined || percentage === null) return null;

  const colorClass = getPercentageColor(percentage);

  return (
    <div className="flex justify-center mb-3">
      <span
        className={`px-3 py-1 text-sm font-medium rounded-full ${colorClass}`}
      >
        {`${percentage}% Match`}
      </span>
    </div>
  );
};

export default PercentageBadge;
