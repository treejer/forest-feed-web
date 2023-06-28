import React from 'react';
import './Switch.css';

export function Switch() {
  return (
    <div className="switch">
      <input type="checkbox" id="switch" />
      <label htmlFor="switch">Toggle</label>
    </div>
  );
}
