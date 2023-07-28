import React from 'react';
import './Switch.css';

export type SwitchProps = {
  id: string;
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function Switch(props: SwitchProps) {
  const {id, label, labelClassName, containerClassName} = props;

  return (
    <div className="flex items-center">
      <div className={`switch ${containerClassName}`}>
        <input {...props} type="checkbox" id={id} />
        <label htmlFor={id} />
      </div>
      {label ? <span className={labelClassName}>{label}</span> : null}
    </div>
  );
}
