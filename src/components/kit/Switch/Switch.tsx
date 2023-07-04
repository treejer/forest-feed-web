import React from 'react';
import './Switch.css';

export type SwitchProps = {
  id: string;
  containerClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function Switch(props: SwitchProps) {
  const {id, containerClassName} = props;

  return (
    <div className={`switch ${containerClassName}`}>
      <input {...props} type="checkbox" id={id} />
      <label htmlFor={id}>Toggle</label>
    </div>
  );
}
