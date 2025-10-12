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
      <div className='flex flex-col items-center'>

        {/*FoundBaseForm*/}
        <div>
          <FoundBaseForm
            title='Report Found Item Form:'
            formData={formData}
            onChange={handleChange}
            onImageSelect={handleImageSelect}
            loading={loading}
            onGenerate={handleGenerate}
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
