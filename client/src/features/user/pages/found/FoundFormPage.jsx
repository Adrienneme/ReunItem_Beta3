import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { createItem } from '../../../../api/items';
import UserNavBar from '../../../../components/layout/UserNavBar';
import FoundBaseForm from '../../../../components/forms/FoundBaseForm';
import ButtonUI from '../../../../components/ui/ButtonUI';

const FoundFormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    item_name: "",
    description: "",
    photo: null,
    pickup_location: "",
    item_type: 'found',
    status: "Pending Approval"
  });

  const [loading, setLoading] = useState(false);
  const [buttonLoading, setbuttonLoading] = useState(false);

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
      //pass ung AI for desciption generation if meron
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setbuttonLoading(true);

    if (!formData.item_name || !formData.description || !formData.photo || !formData.pickup_location) {
      alert('Please fill all inputs, Image of Item is required');
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
      <div className="flex flex-col items-center">

        {/* FoundBaseForm */}
        <FoundBaseForm
          title="Report Found Item:"
          formData={formData}
          onChange={handleChange}
          onImageSelect={handleImageSelect}
          loading={loading}
          onGenerate={handleGenerate}
          onPickupChange={handlePickupChange}
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
  );
};

export default FoundFormPage;
