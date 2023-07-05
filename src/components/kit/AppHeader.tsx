import React from 'react';

import {Logo} from '@forest-feed/components/kit/Icons/Checkbox/LogoIcon';
import {AssetIcon} from '@forest-feed/components/kit/Icons/AssetIcon';
import {TreeIcon} from '@forest-feed/components/kit/Icons/TreeIcon';
import {shortenedString} from '@forest-feed/utils/string';

export type RootLayoutProps = {
  walletAddress: string;
};

export function AppHeader(props: RootLayoutProps) {
  const {walletAddress} = props;
  return (
    <div className="flex items-center justify-between py-4">
      <Logo />
      <div className="flex items-center">
        <div className="border-2 w-36 h-8 rounded-full border-white flex items-center justify-start px-2 -mr-10 text-sm font-semibold">
          {shortenedString(walletAddress, 14, 4)}
        </div>
        <div className="border-2 w-[42px] h-[42px] rounded-full border-white flex items-end justify-end bg-red mb-30">
          <AssetIcon />
        </div>
        <div className="ml-3">
          <TreeIcon />
        </div>
      </div>
    </div>
  );
}
