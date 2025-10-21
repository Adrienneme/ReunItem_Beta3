import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function MultilineInput({
  name, //target name for changing value
  label, //label ngani
  type = 'text',
  value,
  onChange, //passed function for changing the value
  placeholder = '',
  required = false,
  disabled = false,
  rows = 3,
  width = '45ch',
  inputColor = 'white',
  labelColor = 'gray',
  borderColor = 'white',
  variant = 'outlined'
}) {
  return (
    <Box sx={{ '& .MuiTextField-root': { m: 1, width } }}>
      <TextField
        name={name}
        label={label}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        multiline
        rows={rows}
        variant={variant}
        InputProps={{ style: { color: inputColor } }}
        InputLabelProps={{ style: { color: labelColor } }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: borderColor },          
            '&.Mui-focused fieldset': { borderColor: borderColor },
            '& .MuiInputBase-input.Mui-disabled': {
              color: 'white',
              WebkitTextFillColor: 'white', 
              opacity: 1,                   
            },
          },
        }}
      />
    </Box>
  );
}
