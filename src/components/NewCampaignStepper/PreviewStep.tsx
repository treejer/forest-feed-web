import React, {useCallback} from 'react';

import {useTranslations} from 'use-intl';
import {ProfileOwnedByMe} from '@lens-protocol/react-web';

import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {LensterPostView} from '@forest-feed/components/LensterPostView/LensterPostView';
import {GeneralInfoStepState} from '@forest-feed/components/NewCampaignStepper/GeneralInfoStep';

export type PreviewStepProps = {
  generalInfo: GeneralInfoStepState;
  activeProfile: ProfileOwnedByMe | null | undefined;
  onApprove: () => void;
  setActiveStep: (step: number) => void;
  activeStep: number;
  disabled?: boolean;
};
export function PreviewStep(props: PreviewStepProps) {
  const {generalInfo, activeProfile, activeStep, disabled, onApprove, setActiveStep} = props;

  const t = useTranslations();

  const handleBack = useCallback(() => {
    setActiveStep(activeStep - 1);
  }, [activeStep, setActiveStep]);

  return (
    <div>
      <LensterPostView activeProfile={activeProfile} content={generalInfo.content} image={generalInfo.image} />
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
