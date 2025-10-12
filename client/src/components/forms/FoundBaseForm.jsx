import React from 'react'
import Input from '../ui/Input'
import MultilineInput from '../ui/MultiLineInput'

const FoundBaseForm = ({formData, onChange}) => {
  return (
    <div className='flex flex-col items-center'>
      
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
      
      {/*Image Upload*/}

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
