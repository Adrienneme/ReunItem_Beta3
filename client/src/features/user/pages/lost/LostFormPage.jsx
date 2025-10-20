import React, { useState } from 'react'
import UserNavBar from '../../../../components/layout/UserNavBar'
import LostBaseForm from '../../../../components/forms/LostBaseForm'
import ButtonUI from '../../../../components/ui/ButtonUI'
import {Link} from 'react-router-dom'

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

  const handleSubmit = () => {

  }

  return (
    <div>
      <UserNavBar />

      <div className='flex flex-col items-center'>
        <LostBaseForm
          title="Report Lost Item:"
          onImageSelect={handleImageSelect}
          formData={formData}
          onChange={handleChange}
          loading={loading}
          onGenerate={handleGenerate}
        />

        {/* Buttons */}
        <div className="flex flex-row items-center mt-5 mb-10 gap-35">
          <Link to="/user/home">
            <ButtonUI variant="solid" color="neutral">
              Go Back
            </ButtonUI>
          </Link>
          <ButtonUI variant="solid" color="success" onClick={handleSubmit}>
            Submit Entry
          </ButtonUI>
        </div>
      </div>


    </div>
  )
}

export default LostFormPage
