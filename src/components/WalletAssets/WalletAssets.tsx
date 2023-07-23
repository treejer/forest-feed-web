import React from 'react';

import {useAccount, useBalance} from 'wagmi';
import {useTranslations} from 'use-intl';

import {Spacer} from '@forest-feed/components/common/Spacer';
import {DaiIcon} from '@forest-feed/components/kit/Icons/DaiIcon';
import {useConfig} from '@forest-feed/redux/module/web3/web3.slice';

export function WalletAssets() {
  const {contracts} = useConfig();

  const {address} = useAccount();
  const {
    data: dai,
    isLoading,
    error,
    fetchStatus,
  } = useBalance({
    address,
    token: contracts.DAI.address as `0x${string}`,
  });

  const t = useTranslations('newCampaign.assets');

  return (
    <div>
      <span>{t('title')}</span>
      <div className="border border-1 border-LightWhite w-full" />
      <Spacer />
      <div className="flex items-start justify-between">
        <div className="flex">
          <DaiIcon />
          <Spacer />
          <span>{t('dai')}</span>
        </div>
        <Spacer times={2} />
        <span className="text-Green">{dai?.formatted}</span>
      </div>
    </div>
  );
}
