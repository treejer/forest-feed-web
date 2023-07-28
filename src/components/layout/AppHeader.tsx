import React from 'react';

import {ConnectButton} from '@rainbow-me/rainbowkit';
import {useTranslations} from 'use-intl';

import {ConnectionStatus} from '@forest-feed/connectWallet';
import {Logo} from '@forest-feed/components/kit/Icons/LogoIcon';
import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {LensIcon} from '@forest-feed/components/kit/Icons/LensIcon';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {UserWallet} from '@forest-feed/components/layout/UserWallet';
import {RenderIf} from '@forest-feed/components/common/RenderIf';

export type AppHeaderProps = {
  walletAddress?: string;
  isLensLoggedIn?: boolean;
  onLensLogin: () => void;
  onDisconnect: () => void;
  connectionStatus: ConnectionStatus;
};

export function AppHeader(props: AppHeaderProps) {
  const {walletAddress, connectionStatus, isLensLoggedIn, onDisconnect, onLensLogin} = props;

  console.log(isLensLoggedIn, 'isLensLoggedIn');

  const t = useTranslations();

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center">
        <Logo />
        <Spacer times={2} />
        <p className="font-extrabold text-4xl">{t('forestFeed')}</p>
      </div>
      {['connecting', 'reconnecting'].includes(connectionStatus) ? (
        'loading..'
      ) : walletAddress && connectionStatus === 'connected' ? (
        <div className="flex items-center">
          <RenderIf condition={!isLensLoggedIn}>
            <Button
              className="text-sm py-0 pl-1 pr-2 w-auto h-auto"
              icon={<LensIcon />}
              text={t('lens.login')}
              variant={ButtonVariant.secondary}
              onClick={onLensLogin}
            />
            <Spacer />
          </RenderIf>
          <UserWallet walletAddress={walletAddress} onDisconnect={onDisconnect} />
        </div>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
