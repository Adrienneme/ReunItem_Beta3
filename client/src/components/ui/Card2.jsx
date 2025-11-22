import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import expand from "../../assets/icons/expand.png";
import noimage from "../../assets/icons/noimage.jpg";

const Card2 = ({
  name = "Item Name",
  imageUrl = noimage,
  status, // optional
  percentage, // optional
  label, // optional
  linkTo, // optional
  stateData, // optional
  onApprove, // optional button
  onReject, // optional button
  onView,   // optional button
  processing // optional (for disabling buttons)
}) => {
  // Percentage color logic
  const getPercentageColor = (pct) => {
    if (pct >= 80) return "text-green-400";
    if (pct >= 60) return "text-lime-400";
    if (pct >= 40) return "text-yellow-400";
    if (pct >= 20) return "text-orange-400";
    return "text-red-500";
  };

  // Bottom label area
  const renderBottomLabel = () => {
    if (percentage !== undefined)
      return (
        <div className={`font-semibold ${getPercentageColor(percentage)}`}>
          {percentage}% Match
        </div>
      );

    if (label)
      return (
        <div
          className={`px-3 py-1 rounded-full font-semibold ${
            label === "lost" ? "text-red-500" : "text-green-500"
          }`}
        >
          {label}
        </div>
      );

    if (status) return <StatusBadge status={status} />;

    return null;
  };

  return (
    <div className="w-64 bg-gray-900 text-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform hover:scale-105 flex flex-col justify-between">

      {/* Header: Item Name + Expand */}
      <div className="flex justify-between items-center px-4 py-2">
        <h2 className="text-sm font-semibold truncate">{name}</h2>

        {linkTo && (
          <Link
            to={linkTo}
            state={
              percentage !== undefined
                ? { ...stateData, similarity: percentage }
                : { ...stateData }
            }
          >
            <img
              src={expand}
              alt="Expand"
              className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
            />
          </Link>
        )}
      </div>

      {/* Image */}
      <div className="flex justify-center items-center h-40 bg-gray-700">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
      </div>

      {/* Status / Percentage / Label */}
      <div className="flex justify-center items-center py-1 bg-gray-800 border-t border-gray-700">
        {renderBottomLabel()}
      </div>

      {/* Buttons Section (only shows if provided) */}
      {(onApprove || onReject) && (
        <div className="flex justify-around bg-gray-800 py-2 border-t border-gray-700">
          {onApprove && (
            <button
              onClick={onApprove}
              disabled={processing}
              className={`text-xs px-3 py-1 rounded-md font-semibold transition ${
                processing
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Approve
            </button>
          )}

          {onReject && (
            <button
              onClick={onReject}
              disabled={processing}
              className={`text-xs px-3 py-1 rounded-md font-semibold transition ${
                processing
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Reject
            </button>
          )}
        </div>
      )}

      {/* View button (optional) */}
      {onView && (
        <div className="bg-gray-800 py-2 flex justify-center border-t border-gray-700">
          <button
            onClick={onView}
            className="text-xs px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 font-semibold transition"
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
};

export default Card2;
