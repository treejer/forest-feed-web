import React, {useCallback} from 'react';

import {useTranslations} from 'use-intl';

import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {InputRange} from '@forest-feed/components/kit/InputRange/InputRange';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {Switch} from '@forest-feed/components/kit/Switch/Switch';
import {Counter} from '@forest-feed/components/NewCampaignStepper/Counter';
import {CampaignJourneySlice} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';

export type PledgeStepState = Pick<CampaignJourneySlice, 'size' | 'reward' | 'settings'>;

export type PledgeStepProps = {
  campaignSize: number;
  setCampaignSize: React.Dispatch<React.SetStateAction<number>>;
  values: PledgeStepState;
  setCanBeCollected: () => void;
  setCanBeCollectedOnlyFollowers: () => void;
  setOnlyFollowers: () => void;
  setMinimumFollowerNumber: (count: number) => void;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  onProceed: (pledgeState: PledgeStepState) => void;
};

export function PledgeStep(props: PledgeStepProps) {
  const {
    values,
    setCanBeCollected,
    setCanBeCollectedOnlyFollowers,
    setOnlyFollowers,
    setMinimumFollowerNumber,
    setActiveStep,
    campaignSize,
    setCampaignSize,
    onProceed,
  } = props;

  const t = useTranslations();

  const handleChangeCampaignSize = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCampaignSize(+e.target.value);
    },
    [setCampaignSize],
  );

  const handleChangeMinFollowers = useCallback(
    (value: -1 | 1) => {
      setMinimumFollowerNumber(values?.reward?.minimumFollowerNumber + value);
    },
    [setMinimumFollowerNumber, values?.reward?.minimumFollowerNumber],
  );

  const handleBack = useCallback(() => {
    setActiveStep(prevState => prevState - 1);
  }, [setActiveStep]);

  const handleSubmit = useCallback(() => {
    onProceed({
      size: campaignSize,
      reward: {
        minimumFollowerNumber: values.reward.minimumFollowerNumber,
        onlyFollowers: values.reward.onlyFollowers,
      },
      settings: {
        canBeCollected: values.settings.canBeCollected,
        canBeCollectedOnlyFollowers: values.settings.canBeCollectedOnlyFollowers,
      },
    });
  }, [onProceed, campaignSize, values]);

  return (
    <div>
      <span className="text-lg font-bold">{t('newCampaign.campaignSize')}</span>
      <div>
        <span className="font-semibold text-LightWhite text-lg"></span>
      </div>
      <InputRange value={campaignSize} onChange={handleChangeCampaignSize} />
      <div className="flex items-start justify-between text-LightWhite">
        <span>
          {t('countTrees', {
            count: 1,
          })}
        </span>
        <span>
          {t('countTrees', {
            count: 1000,
          })}
        </span>
      </div>
      <Spacer times={4} />
      <div className="font-bold">
        <span className="text-xl font-bold">{t('newCampaign.postSettings')}</span>
      </div>
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
        />
        <span className="text-lg">{t('newCampaign.canBeCollected')}</span>
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
        />
        <span className="text-lg">{t('newCampaign.collectedOnlyFollowers')}</span>
      </div>
      <Spacer times={4} />
      <div>
        <span className="text-lg font-bold">{t('newCampaign.rewardFilters')}</span>
      </div>
      <div className="flex items-center">
        <span className="text-LightWhite">{t('newCampaign.chooseMaxFollowers')}</span>
        <Spacer times={4} />

        <Counter count={values?.reward.minimumFollowerNumber} handleChangeCount={handleChangeMinFollowers} />
      </div>
      <div className="flex items-center">
        <Switch
          containerClassName="mr-1"
          type="checkbox"
          name="rewardFollowers"
          id="rewardFollowers"
          value={0}
          checked={values.reward.onlyFollowers}
          onChange={setOnlyFollowers}
        />
        <span className="text-lg">{t('newCampaign.rewardOnlyYourFollowers')}</span>
      </div>
      <Spacer times={10} />
      <div className="flex items-end justify-end">
        <Button text={t('back')} onClick={handleBack} />
        <Spacer times={2} />
        <Button variant={ButtonVariant.secondary} text={t('proceed')} onClick={handleSubmit} />
      </div>
    </div>
  );
}
