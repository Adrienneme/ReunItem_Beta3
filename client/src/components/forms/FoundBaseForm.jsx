import React from 'react'
import Input from '../ui/Input'
import MultilineInput from '../ui/MultiLineInput'
import ImageUpload from '../ui/ImageUpload'
import StatusBadge from '../ui/StatusBadge'
import GenerateButton from '../ui/GenerateButton'

const FoundBaseForm = ({
  title,
  status = null,
  formData,
  onChange,
  onImageSelect,
  loading = false,
  onGenerate }) => {

  return (
    <div className='flex flex-col items-center'>

      <div className='mb-5'>
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

      <div className='flex flex-row items-center gap-5'>
        {/*Image Upload*/}
        <ImageUpload
          onImageSelect={onImageSelect}
          message='Upload clear photo of Found Item here'
          required={true}
        />
        <div>
          <GenerateButton
            loading={loading}
            onClick={onGenerate}
          />
        </div>
      </div>

      {/*Description*/}
      <MultilineInput
        name='description'
        label='Short Item Description'
        type='text'
        placeholder='e.g. iPhone 12 with a black case and small crack on the upper-right corner of the screen. It was found near the cafeteria table around 2:30 PM.'
        value={formData.description}
        onChange={onChange}
      />

    </div>
  )
}

export default FoundBaseForm
