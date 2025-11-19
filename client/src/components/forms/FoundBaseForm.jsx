import React from 'react';
import Input from '../ui/Input';
import MultilineInput from '../ui/MultilineInput';
import ImageUpload from '../ui/ImageUpload';
import StatusBadge from '../ui/StatusBadge';
import GenerateButton from '../ui/GenerateButton';
import DropDownSelect from '../ui/DropDownSelect';
import PercentageBadge from '../ui/PercentageBadge';

const FoundBaseForm = ({
  title, //title of page if meron
  status = null, //Current status of the item (e.g., "Pending Admin Approval")
  label = null, //Item type label (e.g., "Found" or "Lost")
  formData, //Object containing all form field values: { item_name, description, photo, pickup_location... }
  onChange, /// Function called when text inputs change; receives event
  existingPhoto, //for display of already uploaded or submitted photo
  onImageSelect, //for submission and editing of photo
  loading = false, //loading for description generation 
  onGenerate, //function for passing down the logic of description generation
  onPickupChange, //calls function for users to specify pickup location
  disabled = false, //disables all inputs (for display only)
  disablePickupSelect = false, //admins discretion for changing the pickup location 
  percentage = null
}) => {
  return (
    <div className="flex flex-col items-center justify-center">

      {/* Title and Status Badge */}
      <div className="mb-5 text-center">
        <h1 className="mt-5 mb-3 text-xl font-bold">{title}</h1>
        {status && <StatusBadge status={status} />}
        {percentage && <PercentageBadge percentage={percentage} />}
      </div>

      {/* Item Name */}
      <Input
        name="item_name"
        label="Item Name"
        placeholder="e.g. Phone / Wallet / Bag..."
        value={formData.item_name}
        onChange={onChange}
        required
        disabled={disabled}
      />

      {/* Image Upload and Generate Button */}
      <div className="flex flex-row items-center gap-5 mt-3">
        <ImageUpload
          photo_url={existingPhoto}
          onImageSelect={onImageSelect}
          message="Upload clear photo of Found Item here (Required)"
          disabled={disabled}
          required
        />
        <GenerateButton
          loading={loading}
          onClick={onGenerate}
          disabled={!formData.photo ||disabled}
        />
      </div>

      {/* Description */}
      <MultilineInput
        name="description"
        label="Item Description"
        placeholder="e.g. iPhone 12 with a black case and small crack on the upper-right corner of the screen. It was found near the cafeteria table around 2:30 PM."
        value={formData.description}
        onChange={onChange}
        disabled={disabled}
      />

      {/* Pickup Location Dropdown */}
      <div className="mt-3 w-full max-w-xs">
        <DropDownSelect
          name="pickup_location"
          options={["Gate1", "Gate2", "Gate3", "ADSAS Office", "Tonus Gym"]}
          value={formData.pickup_location}
          onChange={onPickupChange}
          disabled={disabled || disablePickupSelect}
        />
      </div>
    </div>
  );
};

export default FoundBaseForm;
