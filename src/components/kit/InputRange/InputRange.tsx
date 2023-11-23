import React, {useCallback, useState} from 'react';

import './InputRange.scss';
import cn from '@forest-feed/utils/tailwind';

export type InputRangeProps = {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
};

export default function InputRange(props: InputRangeProps) {
  const {value, min = 1, max = 100, disabled, onChange} = props;
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
    <div onMouseDown={handleShow} onMouseUp={handleHide} className={cn('group wrapper transition-all')}>
      <div className={cn('input-wrapper')}>
        <input
          className={cn('input')}
          type="range"
          value={value}
          min={min}
          max={max}
          step={1}
          onChange={onChange}
          disabled={disabled}
        />
      </div>

      <div className={cn('control-wrapper')}>
        <div className={cn('rail overflow-hidden')}>
          <div className={cn('inner-rail')} style={{left: `${minPos}%`, right: `${100 - maxPos}%`}} />
        </div>
        <div className={cn('control relative')} style={{left: `${maxPos}%`}}>
          <div
            onMouseDown={handleShow}
            onMouseUp={handleHide}
            className={cn(
              'absolute transition-all duration-75 right-12 -left-[5px] md:-left-[17px] bg-primaryGreen rounded-[5px] bottom-[30px] w-7 md:w-12 opacity-0 group-focus:opacity-100',
              {
                'opacity-100': show,
              },
              "group-hover:opacity-100 before:content-[''] before:w-0 before:h-0 before:border-x-[transparent] before:border-x-[5px] before:border-t-[5px] before:border-primaryGreen before:absolute before-left-[14px] md:before:left-[20px] before:top-full flex justify-center items-center text-white",
            )}
          >
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}
