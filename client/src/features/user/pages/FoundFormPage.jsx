import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserNavBar from '../../../components/layout/UserNavBar';
import FoundBaseForm from '../../../components/forms/FoundBaseForm';
import ButtonUI from '../../../components/ui/ButtonUI';

const FoundFormPage = () => {
  const [formData, setFormData] = useState({
    item_name: '',
    description: '',
    photo: null,
    pickup_location: '',
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (file) => {
    setFormData(prev => ({ ...prev, photo: file }));
  };

  const handlePickupChange = (val) => {
    setFormData(prev => ({ ...prev, pickup_location: val }));
  };

  const handleGenerate = async () => {
    if (!formData.photo) {
      alert("Please select a photo first.");
      return;
    }

    setLoading(true);

    try {
      const response = await APIforDescriptionGenerator(formData.photo);
      setFormData(prev => ({
        ...prev, description: response.description,
      }));

    } catch (error) {
      const errMsg = error.response?.data?.detail || "Failed to generate description.";
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { item_name, description, photo, pickup_location } = formData;
    if (!item_name || !description || !photo || !pickup_location) {
      alert('Please fill all inputs');
      return;
    }
    console.log('Final submitted data:', formData);
    // TODO: Submit inputs to backend
  };

  return (
    <div>
      <UserNavBar />
      <div className="flex flex-col items-center">

        {/* FoundBaseForm */}
        <FoundBaseForm
          title="Report Found Item Form:"
          formData={formData}
          onChange={handleChange}
          onImageSelect={handleImageSelect}
          loading={loading}
          onGenerate={handleGenerate}
          onPickupChange={handlePickupChange}
        />

        {/* Buttons */}
        <div className="flex flex-row items-center mt-5 mb-10 gap-20">
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
  );
};

export default FoundFormPage;
