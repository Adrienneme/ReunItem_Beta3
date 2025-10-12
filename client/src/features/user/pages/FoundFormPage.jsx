import React, { useState } from 'react'
import UserNavBar from '../../../components/layout/UserNavBar'
import FoundBaseForm from '../../../components/forms/FoundBaseForm'
import ButtonUI from '../../../components/ui/ButtonUI'
import { Link } from 'react-router-dom'

//Found Entry Subsmission Page (Creating Entries)

const FoundFormPage = () => {
  const [formData, setFormData] = useState({
    item_name: "",
    description: "",
    photo: null,
    pickup_location: "",
  })

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Final submitted data:", formData);
  }

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
        <div className='flex flex-row items-center mt-5 mb-10 gap-20'>
          <div>
            <Link to='/user/home'>
              <ButtonUI variant='solid' color='neutral'>
                Go Back
              </ButtonUI>
            </Link>
          </div>
          <div>
            <ButtonUI variant='solid' color='success' onClick={handleSubmit}>
              Submit
            </ButtonUI>
          </div>
        </div>

      </div>
    </div>
  )
}

export default FoundFormPage
