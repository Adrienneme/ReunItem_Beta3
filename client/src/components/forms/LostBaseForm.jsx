import React, {useState} from 'react'
import Input from '../ui/Input'
import StatusBadge from '../ui/StatusBadge'
import ImageUpload from '../ui/ImageUpload'
import GenerateButton from '../ui/GenerateButton'
import MultilineInput from '../ui/MultilineInput'
import PercentageBadge from '../ui/PercentageBadge'
import { ChevronDown, ChevronUp, User } from 'lucide-react';

const LostBaseForm = ({
  title, //different titles for each page (submission(post), display(get), editing(put))
  formData, //pass or update existing data
  status = null, //for display only, update to pending when submitted
  onChange, // for updates and submission for inputs
  existingPhoto, //url for when image already uploaded in database
  onImageSelect, //for updates and submission of photo
  disabled = false, //true if for display only
  onGenerate, //logic for generating item description
  loading = false, //indication for generating description
  percentage = null,
  user
}) => {

  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className='flex flex-col items-center '>
      {/*Title Page w/ badge?*/}
      <div className='mb-5 flex flex-col items-center'>
        <h1 className='mt-5 mb-3 text-xl font-bold'><b>{title}</b></h1>
        {status && (<StatusBadge status={status} />)}
        {percentage && <PercentageBadge percentage={percentage} />}
      </div>

      {/* User Info Dropdown */}
      {user && (
        <div className="w-full max-w-md mb-4">
          <button
            className="w-full flex items-center justify-between bg-#242424 px-7 py-2 rounded-xl shadow hover:bg-#242424 transition"
            onClick={() => setInfoOpen(!infoOpen)}
          >
            <span className="flex items-center gap-2 font-semibold">
              <User size={18} /> Entry By:

            </span>
            <span className="ml-auto text-gray-500 font-light mr-2">View User Information</span>
            {infoOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {infoOpen && (
            <div className="mt-2 bg-#242424 shadow-md rounded-xl p-4 border animate-fadeIn">
              <p className="text-gray-300"><strong>Name:</strong> {user.first_name} {user.last_name}</p>
              <p className="text-gray-300 mt-1"><strong>Email:</strong> {user.contact || user.email}</p>
              <p className="text-gray-300 mt-1"><strong>Contact Number:</strong> {user.contact}</p>
            </div>
          )}
        </div>
      )}

      {/*Item name*/}
      <div>
        <Input
          name='item_name'
          label='Item Name'
          type='text'
          value={formData.item_name}
          onChange={onChange}
          placeholder="e.g. Phone / Wallet / Bag..."
          disabled={disabled}
          required={true}
        />
      </div>

      {/*Image upload*/}
      <div className='flex flex-row items-center'>
        <div>
          <ImageUpload
            photo_url={existingPhoto}
            onImageSelect={onImageSelect}
            message='Upload Clear Photo of Lost Item here (Optional)'
            disabled={disabled}
            required={false}
          />
        </div>
        <div className='ml-5'>
          <GenerateButton
            loading={loading}
            onClick={onGenerate}
            disabled={!formData.photo}
          />
        </div>
      </div>

      {/*description*/}
      <div>
        <MultilineInput
          name='description'
          label='Short Item Description'
          type='text'
          placeholder='e.g. iPhone 12 with a black case and small crack on the upper-right corner of the screen. It was found near the cafeteria table around 2:30 PM.'
          value={formData.description}
          onChange={onChange}
          required={true}
          disabled={disabled}
        />
      </div>

    </div>
  )
}

export default LostBaseForm
