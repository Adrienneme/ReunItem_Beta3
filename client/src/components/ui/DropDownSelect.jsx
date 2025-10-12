import * as React from 'react';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

export default function DropDownSelect() {
  return (
    <Select
      placeholder="Select PickUp Location"
      indicator={<KeyboardArrowDown />}
      sx={{
        width: 240,
        [`& .${selectClasses.indicator}`]: {
          transition: '0.2s',
          [`&.${selectClasses.expanded}`]: {
            transform: 'rotate(-180deg)',
          },
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



  );
}
