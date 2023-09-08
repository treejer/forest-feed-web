import React, {useCallback, useState} from 'react';

import './InputRange.scss';

export type InputRangeProps = {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
};

export function InputRange(props: InputRangeProps) {
  const {value, min = 1, max = 100, onChange} = props;
  const [show, setShow] = useState(false);

  const minPos = ((0 - min) / (max - min)) * 100;

  const maxPos = ((value - min) / (max - min)) * 100;

  const handleShow = useCallback(() => {
    setShow(true);
  }, []);

  const handleHide = useCallback(() => {
    setShow(false);
  }, []);

  return (
    <div onMouseDown={handleShow} onMouseUp={handleHide} className="group wrapper transition-all">
      <div className="input-wrapper">
        <input className="input" type="range" value={value} min={min} max={max} step={1} onChange={onChange} />
      </div>

      <div className="control-wrapper">
        <div className="rail overflow-hidden">
          <div className="inner-rail" style={{left: `${minPos}%`, right: `${100 - maxPos}%`}} />
        </div>
        <div className="control relative" style={{left: `${maxPos}%`}}>
          <div
            onMouseDown={handleShow}
            onMouseUp={handleHide}
            className={`absolute transition-all duration-75 right-12 -left-[5px] md:-left-[17px] bg-primaryGreen rounded-[5px] bottom-[30px] w-7 md:w-12 opacity-0 group-focus:opacity-100 ${
              show ? 'opacity-100' : ''
            } group-hover:opacity-100 before:content-['']
              before:w-0 before:h-0 before:border-x-[transparent] before:border-x-[5px] before:border-t-[5px] before:border-primaryGreen
              before:absolute before-left-[14px] md:before:left-[20px] before:top-full flex justify-center items-center text-white`}
          >
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}
