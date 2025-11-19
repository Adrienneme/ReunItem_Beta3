import React from "react";
import { Link } from "react-router-dom";
import UserNavBar from "../../../../components/layout/UserNavBar";
import LostBaseForm from "../../../../components/forms/LostBaseForm";
import ButtonUI from "../../../../components/ui/ButtonUI";
import useCreate from "../../../../hooks/useCreate";

export default function LostFormPage() {
  const {
    formData,
    loading,
    buttonLoading,
    handleChange,
    handleImageSelect,
    handleGenerate,
    handleSubmit,
  } = useCreate("lost");

  return (
    <div>
      <UserNavBar />
      <div className="flex flex-col items-center">
        <LostBaseForm
          title="Report Lost Item:"
          formData={formData}
          onChange={handleChange}
          onImageSelect={handleImageSelect}
          loading={loading}
          onGenerate={handleGenerate}
        />
        <div className="flex flex-row items-center mt-5 mb-10 gap-10">
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
}
