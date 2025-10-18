import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import expand from '../../assets/icons/expand.png';
import { Link } from "react-router-dom";

const Cards = ({ 
  name = "Item Name", //Name item
  status = "Pending Approval", //Status item
  imageUrl, //Images
  
  
}) => {
  return (
  <div className= "flex flex-col items-center">
    <div className="w-60 border-2 border-black rounded-md overflow-hidden text-center text-black bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Item Name Section w/ Logo */}
      <div className="border-b-2 border-black py-2 font-semibold text-lg">
        <div className="flex justify-between items-center border-b pb-2 px-2">
            <span>{name}</span>
      <Link to="/admin/found-entries">
        <img src={expand} className="size-7 cursor-pointer hover:text-black" />
      </Link>
        </div>
      </div>

      {/* Image Section */}
      <div className="flex justify-center items-center h-40 border-2 border-black m-3 bg-white-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xl font-medium text-black-600">Image</span>
        )}
      </div>

      {/* Status Section */}
      <div className="py-3 text-lg font-semibold border-2 border-black">
        {status && <StatusBadge status={status} />}
      </div>
    </div>
  </div>
  );
};

export default Cards;
