import React, {useCallback, useEffect, useMemo} from 'react';

import Button, {ButtonVariant} from '@forest-feed/components/kit/Button';
import InputRange from '@forest-feed/components/kit/InputRange/InputRange';
import Spacer from '@forest-feed/components/common/Spacer';
import Switch from '@forest-feed/components/kit/Switch/Switch';
import Counter from '@forest-feed/components/NewCampaignStepper/Counter';
import type {CampaignJourneyState} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import useTokens from '@forest-feed/hooks/useToken';
import useRegularSale from '@forest-feed/hooks/useRegularSale';
import usePersistState from '@forest-feed/hooks/usePersistState';
import {storageKeys} from '@forest-feed/config';
import {useI18n} from '@forest-feed/locales/client';
import cn from '@forest-feed/utils/tailwind';

export type PledgeStepState = Pick<CampaignJourneyState, 'size' | 'reward' | 'settings'>;

export type PledgeStepProps = {
  setCampaignSize: (size: number) => void;
  values: PledgeStepState;
  setCanBeCollected: () => void;
  setCanBeCollectedOnlyFollowers: () => void;
  setOnlyFollowers: () => void;
  setMinimumFollowerNumber: (count: number) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
  onProceed: () => void;
};

export default function PledgeStep(props: PledgeStepProps) {
  const {
    values,
    setCampaignSize,
    activeStep,
    setCanBeCollected,
    setCanBeCollectedOnlyFollowers,
    setOnlyFollowers,
    setMinimumFollowerNumber,
    setActiveStep,
    onProceed,
  } = props;

  const [size, setSize, debouncedSize] = usePersistState<number>(values?.size || 1, storageKeys.CAMPAIGN_SIZE, 100);

  useEffect(() => {
    setCampaignSize(debouncedSize);
  }, [debouncedSize]);

  const {
    tokens: {DAI, loading: tokensLoading},
  } = useTokens({didMount: false});
  const {salePrice} = useRegularSale();

  const t = useI18n();

  const handleChangeCampaignSize = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSize(+e.target.value);
    },
    [setSize],
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
    if (DAI === undefined || DAI >= 1000) {
      return 100;
    }
    return Math.floor(DAI / salePrice);
  }, [DAI, salePrice]);

  useEffect(() => {
    if (size > max) {
      setCampaignSize(1);
    }
  }, [max]);

  return (
    <div>
      <p className={cn('text-lg md:text-xl font-extrabold')}>{t('newCampaign.campaignSize')}</p>
      <p className={cn('text-sm text-secondary')}>{t('newCampaign.howManyWantsToPlant')}</p>
      <InputRange
        value={size}
        onChange={handleChangeCampaignSize}
        max={tokensLoading ? 100 : max}
        disabled={max === 0}
      />
      <div className={cn('flex items-start justify-between')}>
        <span className={cn('text-sm text-secondary')}>
          {t('countTrees', {
            count: 1,
          })}
        </span>
        <span className={cn('text-sm text-secondary')}>
          {t('countTrees', {
            count: !tokensLoading ? (max === 0 ? 100 : max) : '...',
          })}
        </span>
      </div>
      <Spacer times={4} />
      <p className={cn('text-lg md:text-xl font-extrabold')}>{t('newCampaign.postSettings')}</p>
      <Spacer times={2} />
      <div className={cn('flex items-center')}>
        <Switch
          containerClassName={cn('mr-1')}
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
          containerClassName={cn('mr-1')}
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
      <div className={cn('flex items-center')}>
        <div>
          <p className={cn('text-lg md:text-xl font-extrabold mb-1')}>{t('newCampaign.rewardFilters')}</p>
          <p className={cn('text-sm text-secondary')}>{t('newCampaign.chooseMaxFollowers')}</p>
        </div>
        <Spacer times={6} />
        <Counter count={values?.reward.minimumFollowerNumber} handleChangeCount={handleChangeMinFollowers} />
      </div>
      <Spacer times={2} />
      <div className={cn('flex items-center')}>
        <Switch
          containerClassName={cn('mr-1')}
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
      <div className={cn('flex items-end justify-end')}>
        <Button text={t('back')} onClick={handleBack} />
        <Spacer times={2} />
        <Button variant={ButtonVariant.secondary} text={t('proceed')} onClick={handleSubmit} />
      </div>
    </div>
  );
}
