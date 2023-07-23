import React from 'react';

import {ConnectButton} from '@rainbow-me/rainbowkit';
import {useTranslations} from 'use-intl';

import {ConnectionStatus} from '@forest-feed/connectWallet';
import {Logo} from '@forest-feed/components/kit/Icons/LogoIcon';
import {AssetIcon} from '@forest-feed/components/kit/Icons/AssetIcon';
import {TreeIcon} from '@forest-feed/components/kit/Icons/TreeIcon';
import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {LensIcon} from '@forest-feed/components/kit/Icons/LensIcon';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {shortenedString} from '@forest-feed/utils/string';
import {useCopyToClipboard} from '@forest-feed/hooks/useCopyToClipboard';

export type AppHeaderProps = {
  walletAddress?: string;
  isLensLoggedIn?: boolean;
  onLensLogin: () => void;
  connectionStatus: ConnectionStatus;
};

export function AppHeader(props: AppHeaderProps) {
  const {walletAddress, connectionStatus, isLensLoggedIn, onLensLogin} = props;

  const [_copiedText, handleCopy] = useCopyToClipboard();

  console.log(isLensLoggedIn, 'isLensLoggedIn');

  const t = useTranslations('lens');

  return (
    <div className="flex items-center justify-between py-4">
      <Logo />
      {['connecting', 'reconnecting'].includes(connectionStatus) ? (
        'loading..'
      ) : walletAddress && connectionStatus === 'connected' ? (
        <div className="flex items-center">
          {!isLensLoggedIn ? (
            <>
              <Button
                className="text-sm py-0.5 pl-1 pr-2 w-auto h-auto"
                icon={<LensIcon />}
                text={t('login')}
                variant={ButtonVariant.secondary}
                onClick={onLensLogin}
              />
              <Spacer />
            </>
          ) : null}
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
        </div>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
