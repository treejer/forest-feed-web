'use client';

import React from 'react';

import {motion} from 'framer-motion';

import {ExitBeforeEnter} from '@forest-feed/components/kit/Animated/ExitBeforeEnter';
import {Spacer} from '@forest-feed/components/common/Spacer';

export type StepperProps = {
  contents: {title: string; content: React.ReactNode}[];
  activeStep: number;
  isDependent: boolean;
  disabled?: boolean;
  setActiveStep: (step: number) => void;
};

const possibleGridCols = ['grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-5', 'grid-cols-6'];

export function Stepper(props: StepperProps) {
  const {contents, activeStep, setActiveStep, isDependent, disabled} = props;

  return (
    <div>
      <div className={`grid grid-cols-${contents.length}`}>
        {contents.map((item, index) => (
          <div key={`${item.title}-${index}`} className="flex flex-col justify-between relative">
            <button
              onClick={() => (isDependent && index >= activeStep ? undefined : setActiveStep(index))}
              className="flex flex-col md:flex-row cursor-pointer justify-center items-center mb-2 md:mb-6"
              disabled={disabled}
            >
              <div
                className={`transition-all w-[24px] h-[24px] rounded-[50%] flex items-center justify-center border text-sm font-bold ${
                  activeStep >= index ? 'bg-primaryGreen text-white border-primaryGreen' : 'border-border'
                }`}
              >
                {index + 1}
              </div>
              <Spacer />
              <span className="text-sm md:text-lg font-medium">{item.title}</span>
            </button>
            {activeStep === index ? (
              <motion.div className="h-[4px] rounded-md underline-stepper bg-primary" layoutId="underline" />
            ) : null}
            <div className="h-[2px] rounded-md bg-activeGray" />
          </div>
        ))}
      </div>

      <Spacer times={5} />

      <ExitBeforeEnter animateKey={contents[activeStep].title}>{contents[activeStep].content}</ExitBeforeEnter>
    </div>
  );
}
