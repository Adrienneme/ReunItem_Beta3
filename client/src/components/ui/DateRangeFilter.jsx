import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

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

    "& .MuiOutlinedInput-root": {
      height: 40,
      "& fieldset": { borderColor: "white" },
      "&:hover fieldset": { borderColor: "white" },
      "&.Mui-focused fieldset": { borderColor: "white" },
    },

    "& .MuiInputLabel-root": {
      color: "white",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "white",
    },

    "& .MuiInputBase-input": {
      color: "white", // <- input text
      padding: "8px 10px",
    },

    "& .MuiSvgIcon-root": {
      color: "gray", // calendar icon
    },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex gap-3 mt-4">
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
