import React from 'react';

import {Spacer} from '@forest-feed/components/common/Spacer';

export type TextAreaProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export function TextArea(props: TextAreaProps) {
  const {label, value, placeholder, onChange} = props;
  return (
    <div className="flex flex-col items-start">
      <label htmlFor={label} className="text-xl font-bold">
        {label}
      </label>

      <textarea
        id={label}
        placeholder={placeholder}
        className="border border-border w-[100%] h-[157px] p-3 rounded-lg font-normal text-lg bg-primaryBg outline-none"
        value={value}
        onChange={onChange}
      />
      <Spacer times={2} />
    </div>
  );
}
