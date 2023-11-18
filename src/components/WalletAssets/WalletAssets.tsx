import React, {useEffect, useMemo, useState} from 'react';

import Link from 'next/link';

import Spacer from '@forest-feed/components/common/Spacer';
import DaiIcon from '@forest-feed/components/kit/Icons/DaiIcon';
import AssetSkeleton from '@forest-feed/components/WalletAssets/AssetSkeleton';
import notEnoughBalance from '@forest-feed/utils/sweetalert';
import RenderIf from '@forest-feed/components/common/RenderIf';
import {useConfig} from '@forest-feed/redux/module/web3/web3.slice';
import useCampaignJourney from '@forest-feed/hooks/useCampaignJourney';
import useTokens from '@forest-feed/hooks/useToken';
import {mumbaiBuyDaiUrl, mumbaiSwapDaiUrl, polygonBuyDaiUrl, polygonSwapDaiUrl} from '@forest-feed/config';
import {useI18n} from '@forest-feed/locales/client';
import cn from '@forest-feed/utils/tailwind';

export type WalletAssetsProps = {
  salePrice: number;
};

export default function WalletAssets(props: WalletAssetsProps) {
  const {salePrice} = props;

  const [balanceError, setBalanceError] = useState(false);

  const {campaignJourney, dispatchSetDisableForm} = useCampaignJourney();
  const {isMainnet} = useConfig();

  const {
    tokens: {DAI, loading},
  } = useTokens();

  const t = useI18n();

  useEffect(() => {
    if (salePrice && DAI !== undefined) {
      const notEnough = DAI < salePrice;
      setBalanceError(notEnough);
      dispatchSetDisableForm(notEnough);
      if (notEnough && !campaignJourney.disableForm && campaignJourney.submissionActiveStep <= 1) {
        notEnoughBalance(t).catch(e => console.log(e, 'error is here'));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salePrice, DAI]);

  const exploreUrls = useMemo(
    () => [
      {
        url: isMainnet ? polygonBuyDaiUrl : mumbaiBuyDaiUrl,
        text: 'buyDai',
      },
      {
        url: isMainnet ? polygonSwapDaiUrl : mumbaiSwapDaiUrl,
        text: isMainnet ? 'swapDai' : 'mintDai',
      },
    ],
    [isMainnet],
  );

  return (
    <div>
      <span className={cn('text-sm md:text-base')}>{t('newCampaign.assets.title')}</span>
      <div className={cn('border border-1 border-LightWhite w-full')} />
      <Spacer />
      {loading ? (
        <AssetSkeleton />
      ) : (
        <>
          <div className={cn('flex items-center justify-between')}>
            <div className={cn('flex items-center text-sm md:text-base')}>
              <DaiIcon />
              <Spacer times={0.5} />
              <span>{t('newCampaign.assets.dai')}</span>
            </div>
            <Spacer times={2} />
            <span className={cn('text-sm lg:text-base text-green')}>{DAI}</span>
          </div>
          <RenderIf condition={balanceError}>
            <p className={cn('text-red text-xs')}>{t('newCampaign.assets.notEnough')}</p>
            <Spacer />
            <ul>
              {exploreUrls.map(item => (
                <li key={item.url}>
                  <Link
                    className={cn('wallet-assets-link')}
                    href={item.url}
                    {...(item.url === '#' ? {} : {target: '_blank'})}
                  >
                    {t(`newCampaign.assets.${item.text}` as any, {})}
                  </Link>
                </li>
              ))}
            </ul>
          </RenderIf>
        </>
      )}
    </div>
  );
}
