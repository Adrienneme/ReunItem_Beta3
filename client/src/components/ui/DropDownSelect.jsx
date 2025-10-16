import React, { useState, useEffect } from "react";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Input from "@mui/joy/Input";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

export default function DropDownSelect({
  name = 'pickup_location',
  options = [],
  value,
  onChange,
  placeholder = "Select an Option",
  disabled = false }) {
  
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
  }, [value]);

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
      <Select
        name={name}
        value={showOtherInput ? "other" : value || ""}
        onChange={handleSelectChange}
        placeholder={placeholder}
        indicator={<KeyboardArrowDown />}
        disabled={disabled}
        sx={{
          width: 300,
          [`& .${selectClasses.indicator}`]: {
            transition: "0.2s",
            [`&.${selectClasses.expanded}`]: { transform: "rotate(-180deg)" },
          },
        }}
      >
        {options.map((option) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
        <Option value="other">Other/Specify</Option>
      </Select>

      {showOtherInput && (
        <Input
          placeholder="Specify location"
          value={otherValue}
          onChange={handleOtherChange}
          sx={{ width: 300 }}
          required={true}
        />
      )}
    </div>
  );
}
