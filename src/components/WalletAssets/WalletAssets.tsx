import React, {useEffect, useState} from 'react';

import {useTranslations} from 'use-intl';

import {Spacer} from '@forest-feed/components/common/Spacer';
import {DaiIcon} from '@forest-feed/components/kit/Icons/DaiIcon';
import {AssetSkeleton} from '@forest-feed/components/WalletAssets/AssetSkeleton';
import {useCampaignJourney} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import {notEnoughBalance} from '@forest-feed/utils/sweetalert';
import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {useTokens} from '@forest-feed/redux/module/tokens/tokens.slice';

export type WalletAssetsProps = {
  salePrice: number;
};

export function WalletAssets(props: WalletAssetsProps) {
  const {salePrice} = props;

  const [balanceError, setBalanceError] = useState(false);

  const {campaignJourney, dispatchSetDisableForm} = useCampaignJourney();

  const {
    tokens: {DAI, loading},
  } = useTokens();

  const t = useTranslations();

  useEffect(() => {
    if (salePrice && DAI !== undefined) {
      const notEnough = DAI < salePrice;
      setBalanceError(notEnough);
      dispatchSetDisableForm(notEnough);
      if (DAI < salePrice && !campaignJourney.disableForm && campaignJourney.submissionActiveStep <= 1) {
        notEnoughBalance(t).catch(e => console.log(e, 'error is here'));
      }
    }
  }, [salePrice, DAI]);

  return (
    <div>
      <span className="text-sm md:text-base">{t('newCampaign.assets.title')}</span>
      <div className="border border-1 border-LightWhite w-full" />
      <Spacer />
      {loading ? (
        <AssetSkeleton />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm md:text-base">
              <DaiIcon />
              <Spacer times={0.5} />
              <span>{t('newCampaign.assets.dai')}</span>
            </div>
            <Spacer times={2} />
            <span className="text-sm lg:text-base text-green">{DAI}</span>
          </div>
          <RenderIf condition={balanceError}>
            <p className="text-red text-xs">{t('newCampaign.assets.notEnough')}</p>
          </RenderIf>
        </>
      )}
    </div>
  );
}
