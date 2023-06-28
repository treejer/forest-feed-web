import React, {useState} from 'react';
import {Button} from '../kit/Button';
import {Spacer} from '../kit/Spacer';

export type CounterProps = {
  count: number;
};

export function Counter() {
  const [count, setCount] = useState(0);

  const changeCount = (value: number) => {
    setCount(count + value);
  };

  return (
    <div className="flex">
      <div className="border rounded-lg w-[48px] h-[48px] border-LightWhite flex items-center justify-center">
        <div className="border rounded-full w-[16px] h-[16px] border-primary flex items-center justify-center">
          <div className="text-primary ">-</div>
        </div>
      </div>
      <Spacer times={2} /> <span className="flex items-center">10</span>
      <Spacer times={2} />
      <div className="border rounded-lg w-[48px] h-[48px] border-LightWhite flex items-center justify-center">
        <div className="border rounded-full w-[16px] h-[16px] border-primary flex items-center justify-center">
          <div className="text-primary mt-[-2px]">+</div>
        </div>
      </div>
    </div>
  );
}
