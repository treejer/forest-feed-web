import React, {useCallback, useState} from 'react';
import {useTranslations} from 'use-intl';

import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {InputRange} from '@forest-feed/components/kit/InputRange/InputRange';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {Switch} from '@forest-feed/components/kit/Switch/Switch';
import {Counter} from '@forest-feed/components/NewCampaignStepper/Counter';
import {CampaignJourney} from '@forest-feed/redux/module/campaignJourney/campaignJourney';

export type PledgeStepState = Pick<CampaignJourney, 'size' | 'reward' | 'settings'>;

export type PledgeStepProps = {
  defaultValues?: PledgeStepState;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  onProceed: (pledgeState: PledgeStepState) => void;
};

export function PledgeStep(props: PledgeStepProps) {
  const {defaultValues, setActiveStep, onProceed} = props;

  const [campaignSize, setCampaignSize] = useState<number>(defaultValues?.size || 1);
  const [minFollowers, setMinFollowers] = useState(defaultValues?.reward?.minimumFollowerNumber || 0);
  const [switches, setSwitches] = useState({
    canCollect: defaultValues?.settings.canBeCollected || false,
    onlyFollowers: defaultValues?.settings.canBeCollectedOnlyFollowers || false,
    rewardFollowers: defaultValues?.reward.onlyFollowers || false,
  });

  const t = useTranslations();

  const handleChangeCampaignSize = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCampaignSize(+e.target.value);
  }, []);

  const handleChangeMinFollowers = useCallback((value: -1 | 1) => {
    setMinFollowers(prevState => prevState + value);
  }, []);

  const handleChangeSwitches = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSwitches({
        ...switches,
        [e.target.name]: !switches[e.target.name],
      });
    },
    [switches],
  );

  const handleBack = useCallback(() => {
    setActiveStep(prevState => prevState - 1);
  }, [setActiveStep]);

  const handleSubmit = useCallback(() => {
    onProceed({
      size: campaignSize,
      reward: {
        minimumFollowerNumber: minFollowers,
        onlyFollowers: switches.rewardFollowers,
      },
      settings: {
        canBeCollected: switches.canCollect,
        canBeCollectedOnlyFollowers: switches.onlyFollowers,
      },
    });
  }, [onProceed, campaignSize, minFollowers, switches]);

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
          checked={switches.canCollect}
          onChange={handleChangeSwitches}
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
          checked={switches.onlyFollowers}
          onChange={handleChangeSwitches}
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

        <Counter count={minFollowers} handleChangeCount={handleChangeMinFollowers} />
      </div>
      <div className="flex items-center">
        <Switch
          containerClassName="mr-1"
          type="checkbox"
          name="rewardFollowers"
          id="rewardFollowers"
          value={0}
          checked={switches.rewardFollowers}
          onChange={handleChangeSwitches}
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
