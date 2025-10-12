import React from 'react';
import Button from '@mui/joy/Button';

const GenerateButton = ({ loading = false, onClick, disabled = false }) => {
  return (
    <div className="flex justify-center my-5">
      <Button
        variant="soft"
        color="warning"
        loading={loading}
        onClick={onClick}
        disabled={disabled}
        className="transition-transform duration-150 hover:scale-105 active:scale-95"
      >
        {loading ? (
          'Generating...'
        ) : (
          <>
            Auto-Generate <br /> Description
          </>
        )}

      </Button>
    </div>
  );
};

export default GenerateButton;
