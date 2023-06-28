import React from 'react';
import './Checkbox.css';

export type CheckBoxProps = {
  text: string;
};

export function Checkbox(props: CheckBoxProps) {
  const {text} = props;
  return (
    <label className="container-checkbox">
      <span className="text-lg">I agree to terms and conditions.</span>
      <input type="checkbox" checked />
      <span className="checkmark"></span>
    </label>
  );
}
