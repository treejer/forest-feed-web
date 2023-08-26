import React, {useMemo, useState} from 'react';

import {Circles} from 'react-loader-spinner';
import {CheckIcon, XMarkIcon} from '@heroicons/react/24/solid';
import {useTranslations} from 'use-intl';

import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {colors} from 'colors';

export function SubmissionStatusStep() {
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(2);
  const [error, setError] = useState(true);

  const t = useTranslations('newCampaign');

  const steps = useMemo(
    () => [
      {
        key: 1,
        text: 'createOnLens',
      },
      {
        key: 2,
        text: 'approveDai',
      },
      {
        key: 3,
        text: 'deposit',
      },
      {
        key: 4,
        text: 'finalize',
      },
    ],
    [],
  );

  return (
    <div>
      <div className="mb-5">
        <p className="text-xl font-bold">{t(error ? 'oops' : 'processing')}</p>
        <p className={`text-sm font-light ${error ? 'text-red' : 'text-secondary'}`}>
          {t(error ? 'failText' : 'bePatient')}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <ul>
          {steps.map(step => (
            <li key={step.key} className="flex items-center mb-2">
              <div
                className={`w-8 h-8 rounded-full flex justify-center items-center border-2 ${
                  activeStep == step.key
                    ? `${
                        step.key === activeStep && error
                          ? 'border-red'
                          : 'border-l-green border-r-green  border-t-border  border-b-border '
                      }${loading ? 'animate-spin' : ''}`
                    : step.key < activeStep
                    ? 'border-green'
                    : step.key === activeStep && error
                    ? 'border-red'
                    : 'border-border'
                }`}
              >
                {step.key < activeStep ? (
                  <CheckIcon className="w-5 h-5 text-green" />
                ) : step.key === activeStep && error ? (
                  <XMarkIcon className="w-5 h-5 text-red" />
                ) : (
                  ''
                )}
              </div>
              <Spacer />
              <p>{t(step.text)}</p>
            </li>
          ))}
        </ul>
        <div>
          <Circles
            height="80"
            width="80"
            color={colors.green}
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={loading}
          />
        </div>
      </div>
      <RenderIf condition={error}>
        <div className="flex justify-end items-center mt-10">
          <Button text={t('cancel')} variant={ButtonVariant.primary} />
          <Spacer />
          <Button text={t('tryAgain')} variant={ButtonVariant.secondary} />
        </div>
      </RenderIf>
    </div>
  );
}
