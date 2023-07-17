import React, {useCallback, useState} from 'react';
import {useTranslations} from 'use-intl';

import {TextArea} from '@forest-feed/components/kit/TextArea';
import {Uploader} from '@forest-feed/components/kit/Uploader';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {Checkbox} from '@forest-feed/components/kit/Icons/Checkbox/Checkbox';
import {useCampaignJourney} from '@forest-feed/redux/module/campaignJourney/campaignJourney';

export type GeneralInfoStepProps = {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  isConfirm: boolean;
  onProceed: (content: string, image: File) => void;
};

export function GeneralInfoStep(props: GeneralInfoStepProps) {
  const {setActiveStep, isConfirm, onProceed} = props;

  const {dispatchApproveGeneralInfo, campaignJourney} = useCampaignJourney();

  console.log(campaignJourney, 'campaignJourney');

  const [content, setContent] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [userAgreed, setUserAgreed] = useState<boolean>(false);

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

  const handleSubmit = () => {
    if (content && uploadedFile) {
      onProceed(content, uploadedFile);
    }
  };

  return (
    <>
      <TextArea
        label={t(isConfirm ? 'newCampaign.postPreview' : 'newCampaign.content')}
        value={content}
        placeholder={t('newCampaign.placeholder.writePost')}
        onChange={handleChangeContent}
      />
      <Uploader
        preview={isConfirm}
        file={uploadedFile}
        onChange={handleChangeUploadedFile}
        onDrop={handleDropUploadedFile}
      />
      <Spacer times={4} />
      <div className="flex">
        <Checkbox
          text={t('privacyPolicy.agreeAppTermsConditions')}
          checked={userAgreed}
          onChange={handleChangeUserAgreed}
        />
      </div>
      <Spacer times={10} />
      <div className="flex items-end justify-end">
        <Button text={t('learnMore')} />
        <Spacer />
        <Button variant={ButtonVariant.secondary} text={t('approve')} onClick={handleSubmit} />
      </div>
    </>
  );
}
