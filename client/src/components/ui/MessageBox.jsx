import React, { useState } from "react";

export default function MessageBox({
  show,
  message,
  onConfirm,
  onCancel,
  confirmColor = "bg-red-500 text-white",
  cancelColor = "bg-gray-300 text-gray-800"
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!show) return null;

  const handleClick = async (callback) => {
    setIsProcessing(true); // disable immediately
    try {
      await callback?.();
    } finally {
      setIsProcessing(false); // re-enable if needed
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200">
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6 w-80 text-center animate-fadeIn">
        <h2 className="text-gray-800 text-lg font-semibold mb-4">{message}</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleClick(onConfirm)}
            disabled={isProcessing}
            className={`px-4 py-2 rounded-lg font-medium transition-transform duration-200 transform 
              shadow-md cursor-pointer ${confirmColor} 
              hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Yes
          </button>
          <button
            onClick={() => handleClick(onCancel)}
            disabled={isProcessing}
            className={`px-4 py-2 rounded-lg font-medium transition-transform duration-200 transform 
              shadow-md cursor-pointer ${cancelColor} 
              hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
