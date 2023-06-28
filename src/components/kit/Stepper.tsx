'use client';

import React, {useState} from 'react';
import {Spacer} from './Spacer';

export type StepperProps = {
  contents: {title: string; content: JSX.Element}[];
  activeStep: number;
  setActiveStep: React.Dispatch<number>;
};

export function Stepper(props: StepperProps) {
  const {contents, activeStep, setActiveStep} = props;

  const colClassName = `grid-cols-4`;

  return (
    <div>
      <div className={`grid ${colClassName}`}>
        {contents.map((item, index) => (
          <div>
            <div onClick={() => setActiveStep(index)} className="flex cursor-pointer">
              <div
                className={`transition-all w-[24px] h-[24px] rounded-[50%] flex items-center justify-center border text-sm font-bold ${
                  activeStep >= index ? 'bg-primaryGreen' : ''
                } ${activeStep >= index ? 'text-white' : ''} ${
                  activeStep >= index ? 'border-primaryGreen' : 'border-border'
                }`}
              >
                {index + 1}
              </div>
              <Spacer />
              <span className="text-lg font-medium">{item.title}</span>
            </div>
            <Spacer times={4} />
            <div className={`transition-all h-[3px] rounded-md ${activeStep === index ? 'bg-primary' : 'bg-white'}`} />
          </div>
        ))}
      </div>

      <div className="border border-1 border-LightWhite" />
      <Spacer times={5} />
      {contents[activeStep].content}
    </div>
  );
}
