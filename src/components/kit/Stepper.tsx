'use client';

import React from 'react';

import {Spacer} from '@forest-feed/components/common/Spacer';

export type StepperProps = {
  contents: {title: string; content: JSX.Element}[];
  activeStep: number;
  isDependent: boolean;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
};

export function Stepper(props: StepperProps) {
  const {contents, activeStep, setActiveStep, isDependent} = props;

  return (
    <div>
      <div className="grid grid-cols-4">
        {contents.map((item, index) => (
          <div key={`${item.title}-${index}`} className="flex flex-col justify-between">
            <div
              onClick={() => (isDependent && index >= activeStep ? undefined : setActiveStep(index))}
              className="flex cursor-pointer mb-6"
            >
              <div
                className={`transition-all w-[24px] h-[24px] rounded-[50%] flex items-center justify-center border text-sm font-bold ${
                  activeStep >= index ? 'bg-primaryGreen text-white border-primaryGreen' : 'border-border'
                }`}
              >
                {index + 1}
              </div>
              <Spacer />
              <span className="text-lg font-medium">{item.title}</span>
            </div>
            <div
              className={`transition-all ${activeStep === index ? 'h-[4px]' : 'h-[2px]'} rounded-md ${
                activeStep === index ? 'bg-primary' : 'bg-activeGray'
              }`}
            />
          </div>
        ))}
      </div>

      <Spacer times={5} />
      {contents[activeStep].content}
    </div>
  );
}
