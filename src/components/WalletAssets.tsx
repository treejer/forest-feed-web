import React from 'react';
import {Spacer} from './kit/Spacer';
import {DaiIcon} from './kit/Icons/DaiIcon';

export function WalletAssets() {
  return (
    <div>
      <span>Wallet Assets</span>
      <div className="border border-1 border-LightWhite" />
      <Spacer />
      <div className="flex items-start justify-between">
        <div className="flex">
          <DaiIcon />
          <Spacer />
          <span>DAI</span>
        </div>
        <Spacer times={2} />
        <span className="text-Green">1200</span>
      </div>
    </div>
  );
}
