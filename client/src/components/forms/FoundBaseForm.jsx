import React from 'react'
import Input from '../ui/Input'
import MultilineInput from '../ui/MultiLineInput'
import ImageUpload from '../ui/ImageUpload'
import StatusBadge from '../ui/StatusBadge'

const FoundBaseForm = ({ title, status = null, formData, onChange, onImageSelect }) => {
  return (
    <div className='flex flex-col items-center'>

      <div>
        <h1 className='mt-5'><b>{title}</b></h1>
        {status && (
          <StatusBadge status={status} />
        )}
      </div>

      {/*Item Name*/}
      <Input
        name='item_name'
        label='Item Name'
        type='text'
        placeholder='e.g. Phone / Wallet / Bag...'
        value={formData.item_name}
        onChange={onChange}
        required={true}
      />

      <div>
        {/*Image Upload*/}
        <ImageUpload
          onImageSelect={onImageSelect}
          message='Upload clear photo of Found Item here'
        />
      </div>

      {/*Description*/}
      <MultilineInput
        name='description'
        label='Short Item Description'
        placeholder='e.g. iPhone 12 with a black case and small crack on the upper-right corner of the screen. It was found near the cafeteria table around 2:30 PM.'
      />


    </div>
  )
}

export default FoundBaseForm
