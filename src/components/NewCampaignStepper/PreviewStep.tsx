import React, {useCallback} from 'react';

import {Profile} from '@lens-protocol/react-web';

import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {HeyPostView} from '@forest-feed/components/HeyPostView/HeyPostView';
import {GeneralInfoStepState} from '@forest-feed/components/NewCampaignStepper/GeneralInfoStep';
import {useI18n} from '@forest-feed/locales/client';

export type PreviewStepProps = {
  generalInfo: GeneralInfoStepState;
  activeProfile: Profile | null | undefined;
  onApprove: () => void;
  setActiveStep: (step: number) => void;
  activeStep: number;
  disabled?: boolean;
};

export function PreviewStep(props: PreviewStepProps) {
  const {generalInfo, activeProfile, activeStep, disabled, onApprove, setActiveStep} = props;

  const t = useI18n();

  const handleBack = useCallback(() => {
    setActiveStep(activeStep - 1);
  }, [activeStep, setActiveStep]);

  return (
    <div>
      <HeyPostView activeProfile={activeProfile} content={generalInfo.content} image={generalInfo.image} />
      <Spacer times={5} />
      <div className="flex items-end justify-end">
        <Button text={t('back')} onClick={handleBack} />
        <Spacer />
        <Button text={t('edit')} onClick={() => setActiveStep(0)} />
        <Spacer />
        <Button
          variant={ButtonVariant.secondary}
          onClick={onApprove}
          disabled={disabled}
          text={t('proceed')}
          type="button"
        />
      </div>
    </div>
  );
}
