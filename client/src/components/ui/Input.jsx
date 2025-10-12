import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false, // ✅ renamed to match React/MUI convention
}) {
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '30ch' }, // margin & fixed width
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        label={label}                // input label
        variant="standard"           // simple underline style
        type={type}                  // input type (text, number, email, etc.)
        value={value}                // input value (controlled)
        onChange={onChange}          // event handler for changes
        placeholder={placeholder}    // hint text
        required={required}          // adds required attribute
        disabled={disabled}          // disables input when true
        sx={{
          // 🎨 Custom styling (great for dark mode)
          '& .MuiInputBase-input': { color: 'white' },                 // input text color
          '& .MuiInputLabel-root': { color: 'gray' },                  // label color
          '& .MuiInput-underline:before': { borderBottomColor: 'white' }, // default underline
          '& .MuiInput-underline:hover:before': { borderBottomColor: 'white' }, // hover underline
          '& .MuiInput-underline:after': { borderBottomColor: 'white' },  // focused underline
        }}
      />
    </Box>
  );
}

/*
📘 PROPS REFERENCE:
- label: string → Input label
- type: "text" | "email" | "number" | "password" | ...
- value: string | number
- onChange: function (e) → handle input changes
- placeholder: string
- required: boolean
- disabled: boolean

  VARIANTS
  1. "outlined"   → Default style with a full border box.
  2. "filled"     → Slightly shaded background with top label.
  3. "standard"   → Minimal underline style (what you’re using now).
*/
