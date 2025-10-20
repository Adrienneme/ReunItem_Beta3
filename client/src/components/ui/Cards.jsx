import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge"; // your existing badge component
import expand from '../../assets/icons/expand.png';
import wallet from '../../assets/samples/wallet.jpg';

const Cards = ({
  name = "Item Name",
  imageUrl = wallet,
  status,        // optional
  percentage,    // optional
  label,         // optional
  linkTo,        // path to navigate on expand
  stateData      // data to pass via Link state
}) => {

  // Determine color for percentage
  const getPercentageColor = (pct) => {
    if (pct >= 80) return "text-green-600";
    if (pct >= 60) return "text-lime-600";
    if (pct >= 40) return "text-yellow-600";
    if (pct >= 20) return "text-orange-600";
    return "text-red-600";
  };

  const renderBottom = () => {
    if (percentage !== undefined) return (
      <div className={`font-semibold ${getPercentageColor(percentage)}`}>
        {percentage}% Complete
      </div>
    );
    if (label) return (
      <div className={`px-3 py-1 rounded-full text-white font-semibold ${label === "Lost" ? "bg-red-500" : "bg-green-500"}`}>
        {label}
      </div>
    );
    if (status) return <StatusBadge status={status} />;
    return null;
  };

  return (
    <div className="flex flex-col items-center w-full sm:w-64 md:w-0.5/4">
      <div className="w-64 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-black bg-gray-400">
        
        {/* Header: Name + Expand */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 truncate">{name}</h2>
            <Link to={linkTo} state={stateData}>
              <img 
                src={expand} 
                alt="Expand" 
                className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" 
              />
            </Link>    
        </div>

        {/* Image */}
        <div className="flex justify-center items-center h-40 bg-gray-50 border-b border-gray-200">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-lg font-medium">No Image</span>
          )}
        </div>

        {/* Bottom Section */}
        <div className="px-4 py-2 mt-2 flex justify-center items-center bg-gray-400">
          {renderBottom()}
        </div>
      </div>
    </div>
  );
};

export default Cards;
