import React, { useState } from 'react'
import UserNavBar from '../../../components/layout/UserNavBar'
import LostBaseForm from '../../../components/forms/LostBaseForm'

//Lost Entry Subsmission Page (Creating Entries)

const LostFormPage = () => {
  const [formData, setFormdata] = useState({
    item_name: "",
    description: "",
    photo: null
  });

  const handleImageSelect = (file) => {
    setFormData({ ...formData, photo: file })
  }
  
  return (
    <div>
      <UserNavBar />
      <LostBaseForm 
        title="Lost Base Form"
        onImageSelect={handleImageSelect}
      /> 
    </div>
  )
}

export default LostFormPage
