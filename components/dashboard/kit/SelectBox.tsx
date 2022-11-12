import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const SelectBox = (props) => {

  return (
    <FormControl>
      <InputLabel>{props.label}</InputLabel>
      <Select required={props.required} value={props.value} onChange={(event) => props.select(event.target.value)}>
        <MenuItem value={props.value} disabled>{props.value}</MenuItem>
        {props.options.map((option) => (
          <MenuItem key={option.categoryId} value={option.name}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
export default SelectBox;