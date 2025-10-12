import React from 'react'
import Input from '../ui/Input'

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
      
      {/*Description*/}


    </div>
  )
}

export default FoundBaseForm
