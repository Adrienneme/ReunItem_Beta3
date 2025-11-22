import React from "react";


const StatusBadge = ({ status }) => {

  return (
    <div className="flex justify-center">
      <span className={`px-3 py-1 text-sm font-medium rounded-full 
        ${status === "Pending Approval" ? " text-yellow-500" : ""}
        ${status === "Pending Claim" ? " text-yellow-500" : ""}
        ${status === "Approved" ? " text-green-500" : ""}
        ${status === "Rejected" ? " text-red-500" : ""}
        ${status === "Claimed" ? " text-blue-500" : ""}
        ${status === "Matched" ? " text-purple-500" : ""}
      `}>
        {`${status}`}
      </span>

    </div>

  );
};

export default StatusBadge;
