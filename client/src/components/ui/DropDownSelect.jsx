import React, { useState, useEffect } from "react";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Input from "@mui/joy/Input";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

export default function DropDownSelect({ name='pickup_location', value, onChange }) {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherValue, setOtherValue] = useState("");

  useEffect(() => {
    if (value && !["gate1","gate2","gate3","ADSAS Office","Tonus Gym"].includes(value)) {
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
        placeholder="Select PickUp Location"
        indicator={<KeyboardArrowDown />}
        sx={{
          width: 240,
          [`& .${selectClasses.indicator}`]: {
            transition: "0.2s",
            [`&.${selectClasses.expanded}`]: { transform: "rotate(-180deg)" },
          },
        }}
      >
        <Option value="gate1">Gate 1</Option>
        <Option value="gate2">Gate 2</Option>
        <Option value="gate3">Gate 3</Option>
        <Option value="ADSAS Office">ADSAS Office</Option>
        <Option value="Tonus Gym">Tonus Gym</Option>
        <Option value="other">Other/Specify</Option>
      </Select>

      {showOtherInput && (
        <Input
          placeholder="Specify location"
          value={otherValue}
          onChange={handleOtherChange}
          sx={{ width: 240 }}
        />
      )}
    </div>
  );
}
