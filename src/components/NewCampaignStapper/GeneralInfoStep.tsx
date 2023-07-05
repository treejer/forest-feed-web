import React, {useCallback, useState} from 'react';

import {TextArea} from '@forest-feed/components/kit/TextArea';
import {Uploader} from '@forest-feed/components/kit/Uploader';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {Checkbox} from '@forest-feed/components/kit/Icons/Checkbox/Checkbox';

export type GeneralInfoStepProps = {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  isConfirm: boolean;
};

export function GeneralInfoStep(props: GeneralInfoStepProps) {
  const {setActiveStep, isConfirm} = props;

  const [content, setContent] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [userAgreed, setUserAgreed] = useState<boolean>(false);

  const handleChangeContent = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, []);

  const handleChangeUploadedFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedFile(e.target?.files?.[0] || null);
  }, []);

  const handleChangeUserAgreed = useCallback(() => {
    setUserAgreed(prevState => !prevState);
  }, []);

  return (
    <>
      <TextArea
        label={isConfirm ? 'Post Preview' : 'Content'}
        value={content}
        placeholder="Write your post here..."
        onChange={handleChangeContent}
      />
      <Uploader preview={isConfirm} file={uploadedFile} onChange={handleChangeUploadedFile} />
      <Spacer times={4} />
      <div className="flex">
        <Checkbox text="I agree to terms and conditions." checked={userAgreed} onChange={handleChangeUserAgreed} />
      </div>
      <Spacer times={10} />
      <div className="flex items-end justify-end">
        <Button text="Learn More" />
        <Spacer />
        <Button variant={ButtonVariant.secondary} text="Approve" onClick={() => setActiveStep(1)} />
      </div>
    </>
  );
}
