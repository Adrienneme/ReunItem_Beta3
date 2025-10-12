import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function MultilineInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disable = false,
}) {
  return (
    <Box
      sx={{'& .MuiTextField-root': { m: 1, width: '45ch' },}}
      noValidate
      autoComplete="off"
    >
      <TextField
        label={label}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disable}
        multiline
        rows={4}
        variant="outlined"
        InputProps={{style: { color: 'white' },}}
        InputLabelProps={{style: { color: 'gray' },}}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'white' }, 
            '&:hover fieldset': { borderColor: 'white' }, 
            '&.Mui-focused fieldset': { borderColor: 'white' }, 
          },
        }}
      />
    </Box>
  );
}
