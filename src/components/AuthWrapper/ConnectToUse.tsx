import React from 'react';

import Image from 'next/image';
import {useTranslations} from 'use-intl';
import {ConnectButton} from '@rainbow-me/rainbowkit';
import {useAccount} from 'wagmi';

import {useAuthLens} from '@forest-feed/hooks/useAuthLens';
import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {LensIcon} from '@forest-feed/components/kit/Icons/LensIcon';

export function ConnectToUse() {
  const {address, status} = useAccount();
  const {lensLoading, handleLensLogin} = useAuthLens();

  const t = useTranslations();

  return (
    <div className="col-span-full w-full h-full flex flex-col items-center">
      <Image src="/assets/images/trees.svg" alt="trees" width={300} height={300} draggable={false} />
      <p className="my-4 text-secondary drop-shadow max-w-2xl text-center">{t('connectToUse.text')}</p>
      {address && status === 'connected' ? (
        <>
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
          <p className="text-green text-sm font-thin">{t('connectToUse.connected')}</p>
        </>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
