import React, { useState } from 'react'
import UserNavBar from '../../../components/layout/UserNavBar'
import LostBaseForm from '../../../components/forms/LostBaseForm'

//Lost Entry Subsmission Page (Creating Entries)

const LostFormPage = () => {
  const [formData, setFormData] = useState({
    item_name: "",
    description: "",
    photo: null
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleImageSelect = (file) => {
    setFormData({ ...formData, photo: file })
  }

  const handleGenerate = async () => {
    setLoading(true);
    // Simulate AI generation - call API 
    setTimeout(() => {
      setFormData({
        ...formData,
        description:
          'Black wallet with a silver zipper found near the library steps around 4 PM.',
      });
      setLoading(false);
    }, 1500);
  }

  
  return (
    <div>
      <UserNavBar />
      <LostBaseForm 
        title="Report Lost Item:"
        onImageSelect={handleImageSelect}
        formData={formData}
        onChange={handleChange}
        loading={loading}
        onGenerate={handleGenerate}
      />

     
    </div>
  )
}

export default LostFormPage
