import React, { useState } from "react";
import StatusBadge from "./StatusBadge";

const Cards = ({ 
  name = "Item Name", //Name item
  status = "Pending Approval", //Status item
  imageUrl, //Images
  
}) => {
  return (
  <div className= "flex flex-col items-center">
    <div className="w-60 border-2 border-black rounded-md overflow-hidden text-center ">
      {/* Item Name Section */}
      <div className="border-b-2 border-black py-2 font-semibold text-lg">
        {name}
      </div>

      {/* Image Section */}
      <div className="flex justify-center items-center h-40 border-2 border-black m-3 bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xl font-medium text-gray-600">Image</span>
        )}
      </div>

      {/* Status Section */}
      <div className="py-3 text-lg font-semibold">
        {status && <StatusBadge status={status} />}
      </div>
    </div>
  </div>
  );
};

export default Cards;
