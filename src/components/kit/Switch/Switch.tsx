import React from 'react';

import './Switch.css';
import cn from '@forest-feed/utils/tailwind';

export type SwitchProps = {
  id: string;
  label?: string;
  labelClassName?: string;
  loading?: boolean;
  containerClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Switch(props: SwitchProps) {
  const {id, label, labelClassName, containerClassName, className, loading, disabled, ...restProps} = props;

  return (
    <div className={cn('flex items-center', {'opacity-50': disabled})}>
      <div className={cn('switch', containerClassName, {'loading-switch': loading})}>
        <input {...restProps} disabled={loading || disabled} type="checkbox" id={id} />
        <label htmlFor={id} />
      </div>
      {label ? <span className={cn('text-sm md:text-base', labelClassName)}>{label}</span> : null}
    </div>
  );
}
