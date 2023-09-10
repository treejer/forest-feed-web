import React from 'react';

import {useAccount} from 'wagmi';
import {ConnectButton} from '@rainbow-me/rainbowkit';
import {useTranslations} from 'use-intl';

import {Logo} from '@forest-feed/components/kit/Icons/LogoIcon';
import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {LensIcon} from '@forest-feed/components/kit/Icons/LensIcon';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {UserWallet} from '@forest-feed/components/layout/UserWallet';
import {AppHeaderSkeleton} from '@forest-feed/components/layout/AppHeaderSkeleton';
import {useAuthLens} from '@forest-feed/hooks/useAuthLens';
import {useProfile} from '@forest-feed/redux/module/profile/profile';
import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';

export function AppHeader() {
  const {address, status} = useAccount();
  const {lensProfile, lensLoading, handleLensLogin, unknownError} = useAuthLens();
  const {dispatchLogoutAccount, profile} = useProfile();

  const {
    web3: {forestLoading, isSupportedNetwork},
    dispatchSignWithForest,
  } = useWeb3();

  const t = useTranslations();

  return (
    <div className="py-4 px-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Logo />
          <Spacer times={2} />
          <p className="font-extrabold text-base lg:text-4xl">{t('forestFeed')}</p>
        </div>
        {['connecting', 'reconnecting'].includes(status) ? (
          <AppHeaderSkeleton />
        ) : address && status === 'connected' ? (
          <div className="flex items-center">
            {isSupportedNetwork && !lensProfile ? (
              <Button
                className="py-0 text-sm w-40 h-10 disabled:bg-primaryGreen shadow-lg hidden md:flex"
                autoSize={false}
                variant={ButtonVariant.secondary}
                text={t('lens.login')}
                icon={<LensIcon />}
                disabled={lensLoading}
                loading={lensLoading}
                onClick={handleLensLogin}
              />
            ) : null}
            {isSupportedNetwork && lensProfile && !profile ? (
              <Button
                className="py-0 text-sm w-40 h-10 disabled:bg-primaryGreen shadow-lg hidden md:flex"
                autoSize={false}
                variant={ButtonVariant.secondary}
                text={t('signWithForest')}
                disabled={forestLoading}
                loading={forestLoading}
                onClick={dispatchSignWithForest}
              />
            ) : null}
            {address ? (
              <>
                <Spacer />
                <UserWallet
                  handle={lensProfile?.handle}
                  address={address}
                  onDisconnect={dispatchLogoutAccount}
                  isSupportedNetwork={isSupportedNetwork}
                />
              </>
            ) : null}
          </div>
        ) : (
          <ConnectButton />
        )}
      </div>
      <div className="flex items-center justify-end mt-1">
        {unknownError ? <p className="text-error text-sm">{t(`lens.errors.${unknownError}`)}</p> : null}
      </div>
    </div>
  );
}
