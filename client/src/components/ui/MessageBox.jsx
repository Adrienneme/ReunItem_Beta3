import React from "react";

export default function MessageBox({
  show,
  message,
  onConfirm,
  onCancel,
  confirmColor = "bg-red-500 hover:bg-red-600 text-white",
  cancelColor = "bg-gray-300 hover:bg-gray-400 text-gray-800"
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200">
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6 w-80 text-center animate-fadeIn">
        <h2 className="text-gray-800 text-lg font-semibold mb-4">{message}</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform 
              hover:scale-105 active:scale-95 shadow-md ${confirmColor}`}
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform 
              hover:scale-105 active:scale-95 shadow-md ${cancelColor}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
