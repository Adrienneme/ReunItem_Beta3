import React from 'react'
import Input from '../ui/Input'
import StatusBadge from '../ui/StatusBadge'
import ImageUpload from '../ui/ImageUpload'
import GenerateButton from '../ui/GenerateButton'
import MultilineInput from '../ui/MultilineInput'

const LostBaseForm = ({
  title, //different titles for each page (submission(post), display(get), editing(put))
  formData, //pass or update existing data
  status = null, //for display only, update to pending when submitted
  onChange, // for updates and submission for inputs
  existingPhoto, //url for when image already uploaded in database
  onImageSelect, //for updates and submission of photo
  disabled = false, //true if for display only
  onGenerate, //logic for generating item description
  loading = false //indication for generating description
}) => {

  return (
    <div className='flex flex-col items-center '>
      {/*Title Page w/ badge?*/}
      <div className='mb-5 flex flex-col items-center'>
        <h1 className='mt-5 text-xl font-bold'><b>{title}</b></h1>
        {status && (
          <StatusBadge status={status} />
        )}
      </div>

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
            disabled={!formData.photo || existingPhoto}
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
        />
      </div>

    </div>
  )
}

export default LostBaseForm
