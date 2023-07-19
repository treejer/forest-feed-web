import React from 'react';

import './Checkbox.css';

export type CheckBoxProps = {
  text: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

export function Checkbox(props: CheckBoxProps) {
  const {text, checked, disabled, onChange} = props;

  return (
    <label className="container-checkbox">
      <span className="text-lg">{text}</span>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
      <span className="checkmark"></span>
    </label>
  );
}
