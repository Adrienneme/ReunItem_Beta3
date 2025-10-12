import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Input({
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false, 
}) {
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '30ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        name={name}
        label={label}              
        variant="standard"       
        type={type}               
        value={value}              
        onChange={onChange}          
        placeholder={placeholder}  
        required={required}          
        disabled={disabled}         
        sx={{
          '& .MuiInputBase-input': { color: 'white' },                 
          '& .MuiInputLabel-root': { color: 'gray' },                  
          '& .MuiInput-underline:before': { borderBottomColor: 'white' }, 
          '& .MuiInput-underline:hover:before': { borderBottomColor: 'white' }, 
          '& .MuiInput-underline:after': { borderBottomColor: 'white' },  
        }}
      />
    </Box>
  );
}

/*
PROPS REFERENCE:
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
