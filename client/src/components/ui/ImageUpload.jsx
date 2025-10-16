import React, { useState, useEffect } from "react";

const ImageUpload = ({
  photo_url = null, //for display
  disabled = false, //true if for display
  onImageSelect, //to change the photo(submission and editing) also to handle the generation (passing the file object)
  message = "Upload Item Photo", //message inside the photo
  required = false //true for 
}) => {
  const [preview, setPreview] = useState(null);

  // Show existing photo if available (for edit or view mode)
  useEffect(() => {
    if (photo_url) setPreview(photo_url);
  }, [photo_url]);

  // When a new image is selected
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
      if (onImageSelect) onImageSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center mt-6 mb-5 text-white">
      <div
        className={`relative w-64 h-64 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden 
          ${disabled
            ? "border-gray-600 bg-gray-700 opacity-70 cursor-not-allowed"
            : "border-gray-400 bg-gray-800 hover:border-green-500 cursor-pointer"
          }`}
      >
        {/* Hidden file input (only active when not disabled) */}
        {!disabled && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            required={required}
          />
        )}

        {/* If preview exists, show image; otherwise show message */}
        {preview ? (
          <img src={preview} alt="Preview" className="object-cover w-full h-full" />
        ) : (
          <p className="text-gray-400 italic text-center px-4 text-sm">
            {disabled ? "No image available" : message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
