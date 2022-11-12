import React from 'react';
import TextField from '@mui/material/TextField';

const TextBox = (props) => {
  return (
    <div>
      <TextField
        className={props.inputBx}
        label={props.label}
        type={props.type}
        InputLabelProps={props.InputLabelProps}
        variant={props.standard}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};

export default TextBox;