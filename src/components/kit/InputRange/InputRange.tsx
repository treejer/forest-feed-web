import React from 'react';

import './InputRange.css';

export type InputRangeProps = {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
};

export function InputRange(props: InputRangeProps) {
  const {value, min = 1, max = 1000, onChange} = props;
  return (
    <div className="slideContainer">
      <input type="range" min={min} max={max} value={value} onChange={onChange} className="slider" id="myRange" />
      <p>
        Value: <span id="demo">{value}</span>
      </p>
    </div>
  );
}
