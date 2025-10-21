import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Input({
  name, //targets the name when changing the value
  label, //label niya duhdoy
  type = "text",
  value, //ano na nasulat
  onChange, //calls the onChange in the parent
  placeholder = "",
  required = true, //true for all
  disabled = false, //true if display
  variant = "standard", // now customizable
  width = "30ch",       // customizable width
  inputColor = "white", // customizable text color
  labelColor = "gray",  // customizable label color
  underlineColor = "white" // customizable underline color
}) {
  return (
    <Box
      sx={{
        '& > :not(style)': { m: 1, width: width },
      }}
    >
      <TextField
        name={name}
        label={label}
        variant={variant}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        sx={{
          '& .MuiInputBase-input': { color: inputColor },
          '& .MuiInputLabel-root': { color: labelColor },
          '& .MuiInput-underline:before': { borderBottomColor: underlineColor },
          '& .MuiInput-underline:hover:before': { borderBottomColor: underlineColor },
          '& .MuiInput-underline:after': { borderBottomColor: underlineColor },
          '& .MuiInputBase-input.Mui-disabled': {
            color: 'white',
            WebkitTextFillColor: 'white', // For Safari to apply white color properly
            opacity: 1,                    // To prevent default opacity dimming
          },
        }}
      />
    </Box>
  );
}

/*
PROPS REFERENCE:
- name: string → input field name
- label: string → input label
- type: "text" | "email" | "number" | "password" | ...
- value: string | number
- onChange: function (e) → handle input changes
- placeholder: string
- required: boolean
- disabled: boolean
- variant: "standard" | "outlined" | "filled" (default "standard")
- width: string (default "30ch")
- inputColor: string (default "white")
- labelColor: string (default "gray")
- underlineColor: string (default "white")
*/
