import React from 'react';
import {TextArea} from '../kit/TextArea';
import {Uploader} from '../kit/Uploader';
import {Spacer} from '../kit/Spacer';
import {Button, ButtonVariant} from '../kit/Button';
import {LikeIcon} from '../kit/Icons/LikeIcon';
import {Checkbox} from '../kit/Icons/Checkbox/Checkbox';

export type GeneralInfoStepProps = {
  setActiveStep: React.Dispatch<number>;
  isConfirm: boolean;
};

export function GeneralInfoStep(props: GeneralInfoStepProps) {
  const {setActiveStep, isConfirm} = props;
  return (
    <>
      <TextArea label={isConfirm ? 'Post Preview' : 'Content'} value="" placeholder="Write your post here..." />
      <Uploader preview={isConfirm} />
      <Spacer times={4} />
      <div className="flex">
        <Checkbox text="" />
      </div>
      <Spacer times={10} />
      <div className="flex items-end justify-end">
        <Button text="Learn More" />
        <Spacer />
        <Button variant={ButtonVariant.secondary} text="Proceed" onClick={() => setActiveStep(1)} />
      </div>
    </>
  );
}
