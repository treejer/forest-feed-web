import React from 'react';

export type CounterProps = {
  count: number;
  // -1: decrement, 1: increment
  handleChangeCount: (value: -1 | 1) => void;
};

export function Counter(props: CounterProps) {
  const {count, handleChangeCount} = props;

  return (
    <div className="flex">
      <button
        className="counter-btn border-lightWhite transition-shadow hover:shadow-lg"
        onClick={() => handleChangeCount(-1)}
      >
        <span className="counter-icon border-primary">-</span>
      </button>
      <span className="flex items-center mx-2">{count}</span>
      <button
        className="counter-btn border-lightWhite transition-shadow hover:shadow-lg"
        onClick={() => handleChangeCount(1)}
      >
        <span className="counter-icon  border-primary">+</span>
      </button>
    </div>
  );
}
