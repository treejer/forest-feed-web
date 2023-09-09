import React, {useCallback, useEffect, useMemo} from 'react';

import {useTranslations} from 'use-intl';

import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {InputRange} from '@forest-feed/components/kit/InputRange/InputRange';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {Switch} from '@forest-feed/components/kit/Switch/Switch';
import {Counter} from '@forest-feed/components/NewCampaignStepper/Counter';
import {CampaignJourneyState} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import {useTokens} from '@forest-feed/redux/module/tokens/tokens.slice';
import {useRegularSale} from '@forest-feed/hooks/useRegularSale';

export type PledgeStepState = Pick<CampaignJourneyState, 'size' | 'reward' | 'settings'>;

export type PledgeStepProps = {
  campaignSize: number;
  setCampaignSize: React.Dispatch<React.SetStateAction<number>>;
  values: PledgeStepState;
  setCanBeCollected: () => void;
  setCanBeCollectedOnlyFollowers: () => void;
  setOnlyFollowers: () => void;
  setMinimumFollowerNumber: (count: number) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
  onProceed: () => void;
};

export function PledgeStep(props: PledgeStepProps) {
  const {
    values,
    campaignSize,
    setCampaignSize,
    activeStep,
    setCanBeCollected,
    setCanBeCollectedOnlyFollowers,
    setOnlyFollowers,
    setMinimumFollowerNumber,
    setActiveStep,
    onProceed,
  } = props;

  const {
    tokens: {DAI, loading: tokensLoading},
  } = useTokens({didMount: false});
  const {salePrice} = useRegularSale();

  const t = useTranslations();

  const handleChangeCampaignSize = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCampaignSize(+e.target.value);
    },
    [setCampaignSize],
  );

  const handleChangeMinFollowers = useCallback(
    (value: -1 | 1) => {
      if (values?.reward?.minimumFollowerNumber + value >= 0) {
        setMinimumFollowerNumber(values?.reward?.minimumFollowerNumber + value);
      }
    },
    [setMinimumFollowerNumber, values?.reward?.minimumFollowerNumber],
  );

  const handleBack = useCallback(() => {
    setActiveStep(activeStep - 1);
  }, [setActiveStep, activeStep]);

  const handleSubmit = useCallback(() => {
    onProceed();
  }, [onProceed]);

  const max = useMemo(() => {
    if (DAI === undefined || DAI >= 1000 || DAI < 10) {
      return 100;
    }
    return Math.floor(DAI / salePrice);
  }, [DAI, salePrice]);

  useEffect(() => {
    if (campaignSize > max) {
      setCampaignSize(1);
    }
  }, [max]);

  return (
    <div>
      <p className="text-lg md:text-xl font-extrabold">{t('newCampaign.campaignSize')}</p>
      <p className="text-sm text-secondary">{t('newCampaign.howManyWantsToPlant')}</p>
      <InputRange value={campaignSize} onChange={handleChangeCampaignSize} max={tokensLoading ? 100 : max} />
      <div className="flex items-start justify-between">
        <span className="text-sm text-secondary">
          {t('countTrees', {
            count: 1,
          })}
        </span>
        <span className="text-sm text-secondary">
          {t('countTrees', {
            count: !tokensLoading ? max : '...',
          })}
        </span>
      </div>
      <Spacer times={4} />
      <p className="text-lg md:text-xl font-extrabold">{t('newCampaign.postSettings')}</p>
      <Spacer times={2} />
      <div className="flex items-center">
        <Switch
          containerClassName="mr-1"
          type="checkbox"
          name="canCollect"
          id="canCollect"
          value={0}
          checked={values?.settings.canBeCollected}
          onChange={setCanBeCollected}
          label={t('newCampaign.canBeCollected')}
        />
      </div>
      <Spacer times={2} />
      <div className="flex items-center">
        <Switch
          containerClassName="mr-1"
          type="checkbox"
          name="onlyFollowers"
          id="onlyFollowers"
          value={0}
          checked={values?.settings.canBeCollectedOnlyFollowers}
          onChange={setCanBeCollectedOnlyFollowers}
          label={t('newCampaign.collectedOnlyFollowers')}
        />
      </div>
      <Spacer times={4} />
      <div className="flex items-center">
        <div>
          <p className="text-lg md:text-xl font-extrabold mb-1">{t('newCampaign.rewardFilters')}</p>
          <p className="text-sm text-secondary">{t('newCampaign.chooseMaxFollowers')}</p>
        </div>
        <Spacer times={6} />
        <Counter count={values?.reward.minimumFollowerNumber} handleChangeCount={handleChangeMinFollowers} />
      </div>
      <Spacer times={2} />
      <div className="flex items-center">
        <Switch
          containerClassName="mr-1"
          type="checkbox"
          name="rewardFollowers"
          id="rewardFollowers"
          value={0}
          checked={values.reward.onlyFollowers}
          onChange={setOnlyFollowers}
          label={t('newCampaign.rewardOnlyYourFollowers')}
        />
      </div>
      <Spacer times={5} />
      <div className="flex items-end justify-end">
        <Button text={t('back')} onClick={handleBack} />
        <Spacer times={2} />
        <Button variant={ButtonVariant.secondary} text={t('proceed')} onClick={handleSubmit} />
      </div>
    </div>
  );
}
