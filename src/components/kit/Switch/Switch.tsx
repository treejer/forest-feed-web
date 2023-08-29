import React from 'react';

import './Switch.css';

export type SwitchProps = {
  id: string;
  label?: string;
  labelClassName?: string;
  loading?: boolean;
  containerClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function Switch(props: SwitchProps) {
  const {id, label, labelClassName, containerClassName, className, loading, disabled, ...restProps} = props;

  return (
    <div className={`flex items-center ${disabled ? 'opacity-50' : ''}`}>
      <div className={`switch ${containerClassName} ${loading ? 'loading-switch' : ''}`}>
        <input {...restProps} disabled={loading || disabled} type="checkbox" id={id} />
        <label htmlFor={id} />
      </div>
      {label ? <span className={labelClassName}>{label}</span> : null}
    </div>
  );
}
