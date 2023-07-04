import React from 'react';

import './Checkbox.css';

export type CheckBoxProps = {
  text: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Checkbox(props: CheckBoxProps) {
  const {text, checked, onChange} = props;

  return (
    <label className="container-checkbox">
      <span className="text-lg">{text}</span>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="checkmark"></span>
    </label>
  );
}
