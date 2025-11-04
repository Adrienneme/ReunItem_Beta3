import React from 'react'
import UserNavBar from '../../../../components/layout/UserNavBar'
import ButtonUI from '../../../../components/ui/ButtonUI'
import { useLocation, useNavigate } from 'react-router-dom'
import useCreate from '../../../../hooks/useCreate'
import { useUpdateItem } from '../../../../hooks/useEdit'
import { useEffect } from 'react'
import FoundBaseForm from '../../../../components/forms/FoundBaseForm'


export default function FoundEdit() {
    const location = useLocation();
    const navigate = useNavigate();
    const { formData: stateForm } = location.state || {};
    const updateMutation = useUpdateItem("found")

    const {
        formData,
        setFormData,
        handleChange,
        handleImageSelect,
        loading,
        handleGenerate,
        handlePickupChange
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
        <div>
            <UserNavBar />
            <FoundBaseForm
                title="Edit Found Item Details:"
                formData={formData}
                disabled={false}
                existingPhoto={formData?.photo_url}
                onChange={handleChange}
                onImageSelect={handleImageSelect}
                loading={loading}
                onGenerate={handleGenerate}
                onPickupChange={handlePickupChange}
            />
            <div className='flex flex-row justify-center gap-10 mt-5'>
                <ButtonUI variant="solid" color="danger"
                    onClick={() => navigate("/user/found-details", { state: { ...formData } })}>
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
