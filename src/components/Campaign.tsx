import React from 'react';
import {Button, ButtonVariant} from './kit/Button';
import {Spacer} from './kit/Spacer';
import {DaiIcon} from './kit/Icons/DaiIcon';
import {WalletAssets} from './WalletAssets';

export type CampaignProps = {
  text: string;
  cost: number;
};

export function Campaign() {
  return (
    <div>
      <span className="font-bold">Trees</span>
      <input
        value="100"
        className="flex bg-lightGreen border border-border rounded-md w-[176px] h-[71px] font-size text-lg font-normal text-center"
      />
      <Spacer />
      <span className="font-bold">Cost</span>
      <input
        value="$1000"
        className="bg-yellow border-border rounded-md w-[176px] h-[71px] font-size text-lg font-normal text-center"
      />
      <Spacer times={4} />
      <WalletAssets />
    </div>
  );
}
