import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useCreate from '../../../../hooks/useCreate'
import UserNavBar from '../../../../components/layout/UserNavBar'
import LostBaseForm from '../../../../components/forms/LostBaseForm'
import ButtonUI from '../../../../components/ui/ButtonUI'
import { useUpdateItem } from '../../../../hooks/useEdit'

export default function LostEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData: stateForm } = location.state || {};
  const updateMutation = useUpdateItem("lost")

  const {
    formData,
    setFormData,
    handleChange,
    handleImageSelect,
    loading,
    handleGenerate
  } = useCreate()

  useEffect(() => {
    if (stateForm) {
      setFormData(stateForm)
    }
  }, [stateForm, setFormData])

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.item_name || !formData.description) {
      alert("Please fill item name and description!")
      return
    }

    updateMutation.mutate({
      entry_id: formData.entry_id,
      formData: formData
    })
  }

  return (
    <div className='mb-10'>
      <UserNavBar />
      <LostBaseForm
        title="Edit Lost Item Details:"
        formData={formData}
        disabled={false}
        existingPhoto={formData?.photo_url}
        onChange={handleChange}
        onImageSelect={handleImageSelect}
        loading={loading}
        onGenerate={handleGenerate}
      />
      <div className='flex flex-row justify-center mt-5 gap-10'>
        <ButtonUI variant="solid" color="danger"
          onClick={() => navigate("/user/lost-details", {state: {...formData}})}>
          Cancel
        </ButtonUI>
        <ButtonUI
          variant="solid"
          color="success"
          onClick={handleSubmit}
          loading={updateMutation.isPending}
          disabled={updateMutation.isPending}
        >
          Confirm Edit
        </ButtonUI>
      </div>
    </div>
  )
}
