import React from 'react';

import Image from 'next/image';
import {ConnectButton} from '@rainbow-me/rainbowkit';
import {useAccount} from 'wagmi';

import useAuthLens from '@forest-feed/hooks/useAuthLens';
import Button, {ButtonVariant} from '@forest-feed/components/kit/Button';
import LensIcon from '@forest-feed/components/kit/Icons/LensIcon';
import useLensProfile from '@forest-feed/hooks/useLensProfile';
import useForestProfile from '@forest-feed/hooks/useForestProfile';
import useWeb3 from '@forest-feed/hooks/useWeb3';
import {useI18n} from '@forest-feed/locales/client';
import {Trees} from 'public/assets/images';
import cn from '@forest-feed/utils/tailwind';

export default function ConnectToUse() {
  const {address, status} = useAccount();
  const {lensLoading} = useAuthLens();
  const {profile} = useForestProfile();
  const {data: lensProfile} = useLensProfile();
  const {
    web3: {forestLoading, isSupportedNetwork},
    dispatchSignWithForest,
    dispatchSetShowSelectProfile,
  } = useWeb3();

  const t = useI18n();

  return (
    <div className={cn('col-span-full w-full h-full flex flex-col items-center')}>
      <Image
        className={cn('-z-10')}
        src={Trees}
        alt="trees"
        width={300}
        height={300}
        placeholder="blur"
        blurDataURL={Trees.blurDataURL}
        draggable={false}
        loading="lazy"
        quality={50}
      />
      <p className={cn('my-4 text-secondary drop-shadow max-w-2xl text-center')}>{t('connectToUse.text')}</p>
      {address && status === 'connected' ? (
        <>
          {isSupportedNetwork ? (
            !lensProfile ? (
              <Button
                className={cn('py-0 text-sm w-40 h-10 disabled:bg-primaryGreen shadow-lg mb-2')}
                autoSize={false}
                variant={ButtonVariant.secondary}
                text={t('lens.login')}
                icon={<LensIcon />}
                disabled={lensLoading}
                loading={lensLoading}
                onClick={() => dispatchSetShowSelectProfile(true)}
              />
            ) : !profile ? (
              <Button
                className={cn('py-0 text-sm w-40 h-10 disabled:bg-primaryGreen shadow-lg mb-2')}
                autoSize={false}
                variant={ButtonVariant.secondary}
                text={t('signWithForest')}
                disabled={forestLoading}
                loading={forestLoading}
                onClick={dispatchSignWithForest}
              />
            ) : null
          ) : null}
          <p className={cn('text-green text-sm font-thin')}>{t('connectToUse.connected')}</p>
          {isSupportedNetwork && lensProfile ? (
            <p className={cn('text-green text-sm font-thin')}>{t('connectToUse.lensLoggedIn')}</p>
          ) : null}
        </>
      ) : ['reconnecting', 'connecting'].includes(status) ? null : (
        <ConnectButton />
      )}
    </div>
  );
}
