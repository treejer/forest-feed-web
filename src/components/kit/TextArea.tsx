import React from 'react';
import cn from '@forest-feed/utils/tailwind';

export type TextAreaProps = {
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  id?: string;
  disabled?: boolean;
};

export default function TextArea(props: TextAreaProps) {
  const {id, value, placeholder, disabled, onChange, onBlur} = props;
  return (
    <div className={cn('flex flex-col items-start')}>
      <textarea
        id={id}
        placeholder={placeholder}
        className={cn(
          'border border-border w-[100%] h-[157px] p-3 rounded-lg font-normal text-sm md:text-lg bg-primaryBg outline-none transition-shadow hover:shadow-lg',
        )}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
      />
    </div>
  );
}
