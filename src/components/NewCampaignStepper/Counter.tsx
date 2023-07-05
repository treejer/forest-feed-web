import React, {useState} from 'react';

export type CounterProps = {
  defaultCount?: number;
};

export function Counter(props: CounterProps) {
  const {defaultCount} = props;

  const [count, setCount] = useState(defaultCount || 0);

  const handleChangeCount = (value: number) => {
    setCount(prevState => (prevState + value >= 0 ? prevState + value : prevState));
  };

  return (
    <div className="flex">
      <button className="counter-btn border-lightWhite" onClick={() => handleChangeCount(-1)}>
        <span className="counter-icon border-primary">-</span>
      </button>
      <span className="flex items-center mx-2">{count}</span>
      <button className="counter-btn border-lightWhite" onClick={() => handleChangeCount(1)}>
        <span className="counter-icon  border-primary">+</span>
      </button>
    </div>
  );
}
