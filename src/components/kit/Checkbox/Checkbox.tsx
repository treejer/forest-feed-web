import React from 'react';

import cn from '@forest-feed/utils/tailwind';
import './Checkbox.css';

export type CheckBoxProps = {
  text?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  disabled?: boolean;
  label?: string;
};

export default function Checkbox(props: CheckBoxProps) {
  const {text, checked, disabled, onChange, onBlur} = props;

  return (
    <label className={cn('container-checkbox')}>
      <span className={cn('text-sm md:text-lg')}>{text}</span>
      <input type="checkbox" checked={checked} onChange={onChange} onBlur={onBlur} disabled={disabled} />
      <span className={cn('checkmark')}></span>
    </label>
  );
}
