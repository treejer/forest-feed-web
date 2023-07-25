import React from 'react';
import {useTranslations} from 'use-intl';

import './InputRange.scss';

export type InputRangeProps = {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
};

export function InputRange(props: InputRangeProps) {
  const {value, min = 1, max = 1000, onChange} = props;

  const t = useTranslations();

  const minPos = ((0 - min) / (max - min)) * 100;

  const maxPos = ((value - min) / (max - min)) * 100;

  return (
    <div className="wrapper">
      <div className="input-wrapper">
        <input className="input" type="range" value={value} min={min} max={max} step={1} onChange={onChange} />
      </div>

      <div className="control-wrapper">
        <div style={{left: `0%`}} />
        <div className="rail overflow-hidden">
          <div className="inner-rail" style={{left: `${minPos}%`, right: `${100 - maxPos}%`}} />
        </div>
        <div className="control" style={{left: `${maxPos}%`}} />
      </div>
    </div>
  );
}
