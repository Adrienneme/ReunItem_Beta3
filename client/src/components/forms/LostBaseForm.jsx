import React, { useState } from 'react'
import Input from '../ui/Input'
import StatusBadge from '../ui/StatusBadge'
import ImageUpload from '../ui/ImageUpload'
import GenerateButton from '../ui/GenerateButton'
import MultilineInput from '../ui/MultilineInput'
import PercentageBadge from '../ui/PercentageBadge'
import { 
  ChevronDown, ChevronUp, User, Tag, 
  FileText, Phone, Camera 
} from 'lucide-react';

const LostBaseForm = ({
  title,
  formData,
  status = null,
  onChange,
  existingPhoto,
  onImageSelect,
  disabled = false,
  onGenerate,
  loading = false,
  percentage = null,
  user
}) => {

  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className="flex flex-col justify-center mx-auto w-full max-w-md">

      {/* Title + Status */}
      <div className="mb-5 text-center">
        <h1 className="mt-5 mb-3 text-xl font-bold">{title}</h1>
        {status && <StatusBadge status={status} />}
        {percentage && <PercentageBadge percentage={percentage} />}
      </div>

      {/* User Info Dropdown */}
      {user && (
        <div className="w-full mb-4">
          <button
            className="w-full flex items-center justify-between bg-#2A3326 px-7 py-2 rounded-xl shadow hover:bg-#242424 transition"
            onClick={() => setInfoOpen(!infoOpen)}
          >
            <span className="flex items-center gap-2 font-semibold">
              <User size={18} /> Entry From:
            </span>

            <span className="ml-auto text-gray-500 font-light mr-2">View User Information</span>

            {infoOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {infoOpen && (
            <div className="mt-2 bg-#242424 shadow-md rounded-xl p-4 border animate-fadeIn">
              <p className="text-gray-300"><strong>Name:</strong> {user.first_name} {user.last_name}</p>
              <p className="text-gray-300 mt-1"><strong>Email:</strong> {user.contact || user.email}</p>
              <p className="text-gray-300 mt-1"><strong>Contact Info:</strong> {formData.contact_number}</p>
            </div>
          )}
        </div>
      )}

      {/* Item Name */}
      <div className="mt-3 w-full">
        <div className="flex items-center gap-2">
          <Tag size={18} className="text-gray-400" />
          <Input
            name="item_name"
            label="Item Name"
            type="text"
            value={formData.item_name}
            onChange={onChange}
            placeholder="e.g. Phone / Wallet / Bag..."
            disabled={disabled}
            required
          />
        </div>
      </div>

      {/* Image Upload + Generate */}
      <div className="flex flex-row items-center gap-5 mt-3">
        <div className="flex items-center gap-2">
          <Camera size={18} className="text-gray-400" />
          <ImageUpload
            photo_url={existingPhoto}
            onImageSelect={onImageSelect}
            message="Upload clear photo (Optional)"
            disabled={disabled}
          />
        </div>

        <GenerateButton
          loading={loading}
          onClick={onGenerate}
          disabled={disabled}
        />
      </div>

      {/* Description */}
      <div className="mt-3 w-full">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-gray-400" />
          <MultilineInput
            name="description"
            label="Short Item Description"
            placeholder="e.g. Black iPhone with cracked corner, last seen near cafeteria..."
            value={formData.description}
            onChange={onChange}
            required
            disabled={disabled}
          />
        </div>
      </div>

      {/* Contact Number */}
      {!disabled && (
        <div className="mt-4 w-full">
          <div className="flex items-center gap-2">
            <Phone size={18} className="text-gray-400" />
            <Input
              name="contact_number"
              label="Contact Information"
              type="tel"
              pattern="[0-9]*"
              inputMode="numeric"
              value={formData.contact_number || ""}
              onChange={onChange}
              placeholder="e.g. Fb / Messenger / phone..."
              required={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LostBaseForm;
