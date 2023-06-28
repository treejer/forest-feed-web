import React from 'react';
import './InputRange.css';

export function InputRange() {
  return (
    <div className="slidecontainer">
      <input type="range" min="1" max="100" value="50" className="slider" id="myRange" />
      <p>
        Value: <span id="demo"></span>
      </p>
    </div>
  );
}
