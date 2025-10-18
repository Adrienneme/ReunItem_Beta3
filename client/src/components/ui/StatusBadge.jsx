import React from "react";

const statusColors = {
  "Pending Approval": "bg-yellow-100 text-yellow-700",
  "Pending Claim": "bg-yellow-300 text-yellow-700",
  "Approved": "bg-green-100 text-green-700",
  "Rejected": "bg-red-100 text-red-700",
  "Claimed": "bg-blue-100 text-blue-700",
  "Matched": "bg-purple-100 text-purple-700",
  "Archived": "bg-gray-200 text-gray-700"
};

const StatusBadge = ({ status }) => {
  const colorClass = statusColors[status] || "bg-gray-100 text-gray-700";

  return (
    <div className="flex justify-center mb-3">
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${colorClass}`}>
        {`Status: ${status}`}
      </span>
    </div>

  );
};

export default StatusBadge;
