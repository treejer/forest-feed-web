import React, {useCallback} from 'react';

import {useTranslations} from 'use-intl';
import {useForm} from 'react-hook-form';

import {Spacer} from '@forest-feed/components/common/Spacer';
import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {CampaignJourneyState} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import {FormController} from '@forest-feed/components/FormController/FormController';
import {GeneralInfoForm, generalInfoYup} from '@forest-feed/validators/generalInfo';

export type GeneralInfoStepState = Pick<CampaignJourneyState, 'content' | 'image' | 'termsConditionAgreed'>;

export type GeneralInfoStepProps = {
  defaultValues?: GeneralInfoStepState;
  activeStep: number;
  setActiveStep: (step: number) => void;
  isConfirm: boolean;
  onProceed: (generalInfo: GeneralInfoStepState) => void;
  loading?: boolean;
};

export function GeneralInfoStep(props: GeneralInfoStepProps) {
  const {defaultValues, isConfirm, activeStep, setActiveStep, onProceed, loading} = props;

  const {control, resetField, setValue, handleSubmit, formState} = useForm<GeneralInfoForm>({
    defaultValues: {
      image: defaultValues?.image ? [defaultValues.image] : null,
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
      setValue('image', e?.target?.files as any, {
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const handleDropUploadedFile = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      setValue('image', e?.dataTransfer?.files as any, {
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
        image: image?.[0],
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
      <RenderIf condition={!isConfirm || !!defaultValues?.image}>
        <FormController
          control={control}
          name="image"
          type="file"
          preview={isConfirm}
          onDrop={handleDropUploadedFile}
          onChange={handleChangeUploadedFile}
          resetField={resetField}
          disabled={isConfirm}
        />
        <div className="hidden md:block">
          <Spacer times={4} />
        </div>
        <div className="block md:hidden">
          <Spacer times={2} />
        </div>
      </RenderIf>
      <FormController
        control={control}
        name="termsConditionAgreed"
        type="checkbox"
        label={t('privacyPolicy.agreeAppTermsConditions')}
        disabled={isConfirm}
        hideLabel
      />
      <div className="hidden md:block">
        <Spacer times={10} />
      </div>
      <div className="block md:hidden">
        <Spacer times={5} />
      </div>
      <div className="flex items-end justify-end">
        <Button text={t(isConfirm ? 'back' : 'learnMore')} disabled={loading} onClick={handleLearnMore} />
        <Spacer />
        <RenderIf condition={isConfirm}>
          <Button disabled={loading} text={t('edit')} onClick={() => setActiveStep(0)} />
          <Spacer />
        </RenderIf>
        <Button
          variant={ButtonVariant.secondary}
          disabled={isConfirm ? loading : !formState.isValid}
          loading={isConfirm ? loading : false}
          text={t('approve')}
          type="submit"
        />
      </div>
    </form>
  );
}
