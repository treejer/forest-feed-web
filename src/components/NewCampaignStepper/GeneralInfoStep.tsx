import React, {useCallback} from 'react';
import {useTranslations} from 'use-intl';
import {useForm} from 'react-hook-form';

import {Spacer} from '@forest-feed/components/common/Spacer';
import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {CampaignJourneySlice} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import {FormController} from '@forest-feed/components/FormController/FormController';
import {GeneralInfoForm, generalInfoYup} from '@forest-feed/validators/generalInfo';

export type GeneralInfoStepState = Pick<CampaignJourneySlice, 'content' | 'image' | 'termsConditionAgreed'>;

export type GeneralInfoStepProps = {
  defaultValues?: GeneralInfoStepState;
  activeStep: number;
  setActiveStep: (step: number) => void;
  isConfirm: boolean;
  onProceed: (generalInfo: GeneralInfoStepState) => void;
};

export function GeneralInfoStep(props: GeneralInfoStepProps) {
  const {defaultValues, isConfirm, activeStep, setActiveStep, onProceed} = props;

  const {control, setValue, handleSubmit, formState} = useForm<GeneralInfoForm>({
    defaultValues: {
      image: defaultValues?.image ? [defaultValues.image] : undefined,
      content: defaultValues?.content || '',
      termsConditionAgreed: defaultValues?.termsConditionAgreed || false,
    },
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: generalInfoYup,
  });

  const t = useTranslations();

  const handleChangeUploadedFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target?.files) {
        setValue('image', e.target?.files as any, {
          shouldTouch: true,
          shouldValidate: true,
        });
      }
    },
    [setValue],
  );

  const handleDropUploadedFile = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      setValue('image', e.dataTransfer?.files as any, {
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const handleLearnMore = useCallback(() => {
    if (isConfirm) {
      setActiveStep(activeStep - 1);
    } else {
      console.log('learn more proceed');
    }
  }, [isConfirm, activeStep, setActiveStep]);

  const onSubmit = useCallback(
    ({content, image, termsConditionAgreed}: GeneralInfoForm) => {
      onProceed({
        content,
        image: image[0],
        termsConditionAgreed,
      });
    },
    [onProceed],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormController
        control={control}
        name="content"
        type="textarea"
        label={t(isConfirm ? 'newCampaign.postPreview' : 'newCampaign.content')}
        placeholder={t('newCampaign.placeholder.writePost')}
        disabled={isConfirm}
      />
      <Spacer times={2} />
      <FormController
        control={control}
        name="image"
        type="file"
        preview={isConfirm}
        onDrop={handleDropUploadedFile}
        onChange={handleChangeUploadedFile}
        disabled={isConfirm}
      />
      <Spacer times={4} />
      <FormController
        control={control}
        name="termsConditionAgreed"
        type="checkbox"
        label={t('privacyPolicy.agreeAppTermsConditions')}
        disabled={isConfirm}
        hideLabel
      />
      <Spacer times={10} />
      <div className="flex items-end justify-end">
        <Button text={t(isConfirm ? 'back' : 'learnMore')} onClick={handleLearnMore} />
        <Spacer />
        <Button variant={ButtonVariant.secondary} disabled={!formState.isValid} text={t('approve')} type="submit" />
      </div>
    </form>
  );
}
