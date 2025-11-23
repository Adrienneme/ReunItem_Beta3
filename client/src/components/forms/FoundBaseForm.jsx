import React, { useState } from 'react';
import Input from '../ui/Input';
import MultilineInput from '../ui/MultilineInput';
import ImageUpload from '../ui/ImageUpload';
import StatusBadge from '../ui/StatusBadge';
import GenerateButton from '../ui/GenerateButton';
import DropDownSelect from '../ui/DropDownSelect';
import PercentageBadge from '../ui/PercentageBadge';
import { 
  ChevronDown, ChevronUp, User, 
  Tag, FileText, MapPin, Phone, Camera 
} from 'lucide-react';

const FoundBaseForm = ({
  title,
  status = null,
  formData,
  onChange,
  existingPhoto,
  onImageSelect,
  loading = false,
  onGenerate,
  onPickupChange,
  disabled = false,
  disablePickupSelect = false,
  percentage = null,
  user
}) => {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className="flex flex-col justify-center mx-auto w-full max-w-md">

      {/* Title */}
      <div className="mb-3 text-center">
        <h1 className="mt-5 mb-2 text-xl font-bold">{title}</h1>
        {status && <StatusBadge status={status} />}
        {percentage && <PercentageBadge percentage={percentage} />}
      </div>

      {/* User Info */}
      {user && (
        <div className="w-full mb-4">
          <button
            className="w-full flex items-center justify-between bg-#242424 px-7 py-2 rounded-xl shadow hover:bg-#242424 transition"
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
              <p className="text-gray-300 mt-1"><strong>Contact Number:</strong> {formData.contact_number}</p>
            </div>
          )}
        </div>
      )}

      {/* Item Name with Icon */}
      <div className="mt-3 w-full">
        <div className="flex items-center gap-2">
          <Tag size={18} className="text-gray-400" />
          <Input
            name="item_name"
            label="Item Name"
            placeholder="e.g. Phone / Wallet / Bag..."
            value={formData.item_name}
            onChange={onChange}
            required
            disabled={disabled}
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
            message="Upload clear photo (Required)"
            disabled={disabled}
            required
          />
        </div>

        <GenerateButton
          loading={loading}
          onClick={onGenerate}
          disabled={!formData.photo || disabled}
        />
      </div>

      {/* Description */}
      <div className="mt-3 w-full">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-gray-400" />
          <MultilineInput
            name="description"
            label="Item Description"
            placeholder="e.g. iPhone 12 with a black case..."
            value={formData.description}
            onChange={onChange}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Pickup Location */}
      <div className="mt-3 w-full">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-gray-400" />
          <DropDownSelect
            name="pickup_location"
            options={["Gate1", "Gate2", "Gate3", "ADSAS Office", "Tonus Gym"]}
            value={formData.pickup_location}
            onChange={onPickupChange}
            disabled={disabled || disablePickupSelect}
          />
        </div>
      </div>

      {/* Contact Number (only when not disabled) */}
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
              placeholder="Enter your contact number"
              required={false}
              disabled={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FoundBaseForm;
