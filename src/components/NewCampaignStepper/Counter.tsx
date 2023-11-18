import React from 'react';
import {cn} from '@forest-feed/utils/tailwind';

export type CounterProps = {
  count: number;
  // -1: decrement, 1: increment
  handleChangeCount: (value: -1 | 1) => void;
};

export function Counter(props: CounterProps) {
  const {count, handleChangeCount} = props;

  return (
    <div className={cn('flex')}>
      <button
        className={cn('counter-btn border-lightWhite transition-shadow hover:shadow-lg')}
        onClick={() => handleChangeCount(-1)}
      >
        <span className={cn('counter-icon border-primary')}>-</span>
      </button>
      <span className={cn('flex items-center mx-2 text-sm md:text-base')}>{count}</span>
      <button
        className={cn('counter-btn border-lightWhite transition-shadow hover:shadow-lg')}
        onClick={() => handleChangeCount(1)}
      >
        <span className={cn('counter-icon border-primary')}>+</span>
      </button>
    </div>
  );
}
