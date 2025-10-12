import React, { useState } from 'react'
import UserNavBar from '../../../components/layout/UserNavBar'
import FoundBaseForm from '../../../components/forms/FoundBaseForm'
import ButtonUI from '../../../components/ui/ButtonUI'

//Found Entry Subsmission Page (Creating Entries)

const FoundFormPage = () => {
  const [formData, setFormData] = useState({
    item_name: "",
    description: "",
    photo: null
  })

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleImageSelect = (file) => {
    setFormData({...formData, photo:file})
  }

  return (
    <div>
      <UserNavBar />
      <div className='flex flex-col items-center'>

        <h1 className='mt-5'>Report Found Item:</h1>
        {/*FoundBaseForm*/}
        <div>
          <FoundBaseForm 
            formData={formData} 
            onChange={handleChange} 
            onImageSelect={handleImageSelect}
          />
        </div>

        {/*BUtton Functions*/}
        <div className='flex flex-col items-center'>
          <ButtonUI variant='solid' color='success'>
            Submit
          </ButtonUI>
        </div>

      </div>
    </div>
  )
}

export default FoundFormPage
