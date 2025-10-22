import React, { useState } from 'react'
import UserNavBar from '../../../../components/layout/UserNavBar'
import LostBaseForm from '../../../../components/forms/LostBaseForm'
import ButtonUI from '../../../../components/ui/ButtonUI'
import { Link, useNavigate } from 'react-router-dom'
import { createItem, generateDescription } from '../../../../api/items'


const LostFormPage = () => {
  const [formData, setFormData] = useState({
    item_name: "",
    description: "",
    photo: null,
    item_type: 'lost',
    status: "Pending Approval"
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setbuttonLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (file) => {
    setFormData(prev => ({ ...prev, photo: file }));
  };

  const handleGenerate = async () => {

    if (!formData.photo) {
      alert("No photo found!");
      return;
    }
    setLoading(true);

    try {
      const response = await generateDescription(formData.photo);
      console.log("Backend response:", response);
      setFormData(prev => ({
        ...prev, description: response.description
      }));

    } catch (error) {
      console.error("Error generating description:", error);
      const errMsg = error.response?.data?.detail || "Failed to generate description.";
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setbuttonLoading(true);

    if (!formData.item_name || !formData.description) {
      alert('Please fill item name and description');
      setbuttonLoading(false);
      return;
    }
    try {
      const response = await createItem(formData);
      console.log("Successfully created Item:", response)
      alert('Entry Submitted!')
      navigate('/user/home')

    } catch (error) {
      const errMsg = error.response?.data?.detail || "Failed to submit entry.";
      console.log(error.response?.data.detail);
      alert(errMsg);
    } finally {
      setbuttonLoading(false)
    }
  };

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
          <ButtonUI
            variant="solid"
            color="success"
            onClick={handleSubmit}
            loading={buttonLoading}
            disabled={buttonLoading}
          >
            Submit Entry
          </ButtonUI>
        </div>
      </div>


    </div>
  )
}

export default LostFormPage
