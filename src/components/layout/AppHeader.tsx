import React from 'react';

import {ConnectButton} from '@rainbow-me/rainbowkit';

import {Logo} from '@forest-feed/components/kit/Icons/Checkbox/LogoIcon';
import {AssetIcon} from '@forest-feed/components/kit/Icons/AssetIcon';
import {TreeIcon} from '@forest-feed/components/kit/Icons/TreeIcon';
import {ConnectionStatus} from '@forest-feed/connectWallet';
import {shortenedString} from '@forest-feed/utils/string';
import {useCopyToClipboard} from '@forest-feed/hooks/useCopyToClipboard';

export type RootLayoutProps = {
  walletAddress?: string;
  connectionStatus: ConnectionStatus;
};

export function AppHeader(props: RootLayoutProps) {
  const {walletAddress, connectionStatus} = props;

  const [_copiedText, handleCopy] = useCopyToClipboard();

  return (
    <div className="flex items-center justify-between py-4">
      <Logo />
      {['connecting', 'reconnecting'].includes(connectionStatus) ? (
        'loading..'
      ) : walletAddress && connectionStatus === 'connected' ? (
        <div className="flex items-center">
          <button
            onClick={() => handleCopy(walletAddress)}
            className="border-2 w-[150px] h-8 rounded-full border-white flex items-center justify-start pl-3 -mr-8 text-sm font-semibold cursor-pointer"
          >
            {shortenedString(walletAddress, 14, 4)}
          </button>
          <div className="border-2 w-[42px] h-[42px] rounded-full border-white flex items-end justify-end bg-red mb-30">
            <AssetIcon />
          </div>
          <div className="ml-3">
            <TreeIcon />
          </div>
        </div>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
