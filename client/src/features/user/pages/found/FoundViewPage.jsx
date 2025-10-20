import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import FoundBaseForm from "../../../../components/forms/FoundBaseForm";
import ButtonUI from "../../../../components/ui/ButtonUI";
import UserNavBar from "../../../../components/layout/UserNavBar";


export default function FoundViewPage() {
  

  return (
    <div>
      <UserNavBar />
      <div className="min-h-screen flex flex-col items-center justify-center">
        <FoundBaseForm
          title="Reported Item Details:"
          formData={formData}
          status={null}
          existingPhoto={photo}
          disabled={true}
          disablePickupSelect={true}
        />

        <div className="flex flex-row items-center mt-5 mb-10 gap-8">
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
}
