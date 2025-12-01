import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function DateRangeFilter({ startDate, endDate, onChange }) {
  const handleStartChange = (newValue) => {
    onChange({
      startDate: newValue,
      endDate: endDate,
    });
  };

  const handleEndChange = (newValue) => {
    onChange({
      startDate: startDate,
      endDate: newValue,
    });
  };

const textFieldSx = {
  width: 180,

  // ROOT — forces white text everywhere
  "& *": {
    color: "white !important",
    borderColor: "white !important",
  },

  // OUTLINED INPUT ROOT
  "& .MuiOutlinedInput-root": {
    height: 40,

    "& fieldset": {
      borderColor: "white !important",
    },
    "&:hover fieldset": {
      borderColor: "white !important",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white !important",
    },
  },

  // LABEL
  "& .MuiInputLabel-root": {
    color: "white !important",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "white !important",
  },

  // INPUT TEXT
  "& .MuiInputBase-input": {
    color: "white !important",
  },

  // PLACEHOLDER
  "& .MuiInputBase-input::placeholder": {
    color: "white !important",
    opacity: 1,
  },

  // CALENDAR ICON
  "& .MuiSvgIcon-root": {
    color: "white !important",
  },
};


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex gap-3">
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={handleStartChange}
          slotProps={{
            textField: {
              size: "small",
              sx: textFieldSx,
            },
          }}
        />

        <DatePicker
          label="End Date"
          value={endDate}
          onChange={handleEndChange}
          slotProps={{
            textField: {
              size: "small",
              sx: textFieldSx,
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
}
