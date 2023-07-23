import React, {useCallback, useState} from 'react';
import {useTranslations} from 'use-intl';

import {TextArea} from '@forest-feed/components/kit/TextArea';
import {Uploader} from '@forest-feed/components/kit/Uploader';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {Checkbox} from '@forest-feed/components/kit/Checkbox/Checkbox';
import {CampaignJourneySlice} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';

export type GeneralInfoStepState = Pick<CampaignJourneySlice, 'content' | 'image' | 'termsConditionAgreed'>;

export type GeneralInfoStepProps = {
  defaultValues?: GeneralInfoStepState;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  isConfirm: boolean;
  onProceed: (generalInfo: GeneralInfoStepState) => void;
};

export function GeneralInfoStep(props: GeneralInfoStepProps) {
  const {defaultValues, isConfirm, setActiveStep, onProceed} = props;

  const [content, setContent] = useState<string>(defaultValues?.content || '');
  const [uploadedFile, setUploadedFile] = useState<File | null>(defaultValues?.image || null);
  const [userAgreed, setUserAgreed] = useState<boolean>(defaultValues?.termsConditionAgreed || false);

  const t = useTranslations();

  const handleChangeContent = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, []);

  const handleChangeUploadedFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedFile(e.target?.files?.[0] || null);
  }, []);

  const handleDropUploadedFile = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    setUploadedFile(e.dataTransfer?.files?.[0] || null);
  }, []);

  const handleChangeUserAgreed = useCallback(() => {
    setUserAgreed(prevState => !prevState);
  }, []);

  const handleLearnMore = useCallback(() => {
    if (isConfirm) {
      setActiveStep(prevState => prevState - 1);
    } else {
      console.log('learn more proceed');
    }
  }, [isConfirm, setActiveStep]);

  const handleSubmit = useCallback(() => {
    if (content && uploadedFile && userAgreed) {
      onProceed({termsConditionAgreed: userAgreed, image: uploadedFile, content});
    }
  }, [onProceed, content, uploadedFile, userAgreed]);

  return (
    <>
      <TextArea
        label={t(isConfirm ? 'newCampaign.postPreview' : 'newCampaign.content')}
        value={content}
        placeholder={t('newCampaign.placeholder.writePost')}
        onChange={handleChangeContent}
        disabled={isConfirm}
      />
      <Uploader
        preview={isConfirm}
        file={uploadedFile}
        onChange={handleChangeUploadedFile}
        onDrop={handleDropUploadedFile}
        disabled={isConfirm}
      />
      <Spacer times={4} />
      <div className="flex">
        <Checkbox
          text={t('privacyPolicy.agreeAppTermsConditions')}
          checked={userAgreed}
          onChange={handleChangeUserAgreed}
          disabled={isConfirm}
        />
      </div>
      <Spacer times={10} />
      <div className="flex items-end justify-end">
        <Button text={t(isConfirm ? 'back' : 'learnMore')} onClick={handleLearnMore} />
        <Spacer />
        <Button variant={ButtonVariant.secondary} text={t('approve')} disabled={!userAgreed} onClick={handleSubmit} />
      </div>
    </>
  );
}
