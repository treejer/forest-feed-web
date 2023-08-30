import React from 'react';

import Image from 'next/image';
import {useTranslations} from 'use-intl';
import {ConnectButton} from '@rainbow-me/rainbowkit';
import {useAccount} from 'wagmi';

import {useAuthLens} from '@forest-feed/hooks/useAuthLens';
import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {LensIcon} from '@forest-feed/components/kit/Icons/LensIcon';
import {useProfile} from '@forest-feed/redux/module/profile/profile';
import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';

export function ConnectToUse() {
  const {address, status} = useAccount();
  const {lensLoading, handleLensLogin, lensProfile} = useAuthLens();
  const {profile} = useProfile();
  const {
    web3: {forestLoading, isSupportedNetwork},
    dispatchSignWithForest,
  } = useWeb3();

  const t = useTranslations();

  return (
    <div className="col-span-full w-full h-full flex flex-col items-center">
      <Image src="/assets/images/trees.svg" alt="trees" width={300} height={300} draggable={false} />
      <p className="my-4 text-secondary drop-shadow max-w-2xl text-center">{t('connectToUse.text')}</p>
      {address && status === 'connected' ? (
        <>
          {isSupportedNetwork ? (
            !lensProfile ? (
              <Button
                className="py-0 text-sm w-40 h-10 disabled:bg-primaryGreen shadow-lg mb-2"
                autoSize={false}
                variant={ButtonVariant.secondary}
                text={t('lens.login')}
                icon={<LensIcon />}
                disabled={lensLoading}
                loading={lensLoading}
                onClick={handleLensLogin}
              />
            ) : !profile ? (
              <Button
                className="py-0 text-sm w-40 h-10 disabled:bg-primaryGreen shadow-lg mb-2"
                autoSize={false}
                variant={ButtonVariant.secondary}
                text={t('signWithForest')}
                disabled={forestLoading}
                loading={forestLoading}
                onClick={dispatchSignWithForest}
              />
            ) : null
          ) : null}
          <p className="text-green text-sm font-thin">{t('connectToUse.connected')}</p>
          {isSupportedNetwork && lensProfile ? (
            <p className="text-green text-sm font-thin">{t('connectToUse.lensLoggedIn')}</p>
          ) : null}
        </>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
