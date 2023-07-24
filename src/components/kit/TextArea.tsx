import React from 'react';

export type TextAreaProps = {
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  id?: string;
  disabled?: boolean;
};

export function TextArea(props: TextAreaProps) {
  const {id, value, placeholder, disabled, onChange, onBlur} = props;
  return (
    <div className="flex flex-col items-start">
      <textarea
        id={id}
        placeholder={placeholder}
        className="border border-border w-[100%] h-[157px] p-3 rounded-lg font-normal text-lg bg-primaryBg outline-none transition-shadow hover:shadow-lg"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
      />
    </div>
  );
}
