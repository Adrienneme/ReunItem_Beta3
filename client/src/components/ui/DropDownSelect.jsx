import React, { useState, useEffect } from "react";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Input from "@mui/joy/Input";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

export default function DropDownSelect({
  name = "pickup_location",
  options = [],
  value,
  onChange,
  placeholder = "Select an Option",
  disabled = false,
}) {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherValue, setOtherValue] = useState("");

  useEffect(() => {
    if (value && !options.includes(value)) {
      setShowOtherInput(true);
      setOtherValue(value);
    } else {
      setShowOtherInput(false);
      setOtherValue("");
    }
  }, [value, options]);

  const handleSelectChange = (event, newValue) => {
    if (newValue === "other") {
      setShowOtherInput(true);
    } else {
      setShowOtherInput(false);
      onChange(newValue);
    }
  };

  const handleOtherChange = (e) => {
    setOtherValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2">
        <label
        htmlFor={name}
        className="text-sm font-semibold text-gray-100"
        style={{
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? "not-allowed" : "default",
        }}
      >
        Pickup Location:
      </label>
      <Select
        name={name}
        value={showOtherInput ? "other" : value || ""}
        onChange={handleSelectChange}
        placeholder={placeholder}
        indicator={<KeyboardArrowDown />}
        disabled={disabled}
        sx={{
          width: 300,
          backgroundColor: "#eaeaea", // light gray
          color: "black",
          "--Select-placeholderColor": "#555",
          "--Select-focusedHighlight": "black",
          "--Select-focusedBorderColor": "#999",
          [`& .${selectClasses.indicator}`]: {
            transition: "0.2s",
            [`&.${selectClasses.expanded}`]: { transform: "rotate(-180deg)" },
          },
          "&:hover": {
            backgroundColor: "#dcdcdc",
          },
          // ✅ Keep black text even when disabled
          "&.Mui-disabled": {
            opacity: 1,
            color: "black",
            backgroundColor: "#e0e0e0",
          },
        }}
      >
        {options.map((option) => (
          <Option
            key={option}
            value={option}
            sx={{
              backgroundColor: "#f0f0f0",
              color: "black",
              "&:hover": { backgroundColor: "#dcdcdc" },
            }}
          >
            {option}
          </Option>
        ))}
        <Option
          value="other"
          sx={{
            backgroundColor: "#f0f0f0",
            color: "black",
            "&:hover": { backgroundColor: "#dcdcdc" },
          }}
        >
          Other / Specify
        </Option>
      </Select>

      {showOtherInput && (
        <Input
          placeholder="Specify location"
          value={otherValue}
          onChange={handleOtherChange}
          required
          disabled={disabled}
          sx={{
            width: 300,
            backgroundColor: "#eaeaea",
            color: "black",
            "&::placeholder": { color: "#555" },
            "&:hover": { backgroundColor: "#dcdcdc" },
            // ✅ Keep black text even when disabled
            "&.Mui-disabled": {
              opacity: 1,
              color: "black",
              WebkitTextFillColor: "black",
              backgroundColor: "#e0e0e0",
            },
          }}
        />
      )}
    </div>
  );
}
