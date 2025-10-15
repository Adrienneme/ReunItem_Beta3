import React from 'react'
import Input from '../ui/Input'
import StatusBadge from '../ui/StatusBadge'
import ImageUpload from '../ui/ImageUpload'
import GenerateButton from '../ui/GenerateButton'

const LostBaseForm = ({
  title,
  formData,
  status = "Pending Admin Approval",
  onChange,
  onImageSelect,
  disabled = false,
  onGenerate,
  loading = false
}) => {

  return (
    <div className='flex flex-col items-center '>
      {/*Title Page w/ badge?*/}
      <div className='mb-5'>
        <h1 className='mt-5 mb-5'><b>{title}</b></h1>
        {status && (
          <StatusBadge status={status} />
        )}
      </div>

      {/*Item name*/}
      <div>
        <Input
          name = "item_name"
          label = "Item Name"
          type= "text"
          value = {formData}
          onChange = {onChange}
          placeholder = "e.g. Phone / Wallet / Bag..."
          disabled={disabled}
          required={true}
        />
      </div>

      {/*Image upload*/}
     <div className='flex flex-row items-center'>
       <div>
        <ImageUpload 
          onImageSelect={onImageSelect}
          message='Upload Clear Photo of Lost Item here'
          disabled={disabled}
          required={false}
        />
      </div>
      <div className='ml-5'>
        <GenerateButton
          loading={loading}
          onClick={onGenerate}
          disabled={false}
        />
      </div>
     </div>

    </div>
  )
}

export default LostBaseForm
