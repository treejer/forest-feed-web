import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {useQuery} from '@apollo/client';
import {ProfileId, useActiveProfile} from '@lens-protocol/react-web';
import {CheckIcon, XMarkIcon} from '@heroicons/react/24/solid';
import {Circles} from 'react-loader-spinner';
import {useTranslations} from 'use-intl';

import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {publicationIds, publicationIdsVariables} from '@forest-feed/constants/graphQl/publicationIds';
import {useCampaignJourney} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import {useApproveDai} from '@forest-feed/hooks/useApproveDai';
import {useDepositToForestFeed} from '@forest-feed/hooks/useDepositToForestFeed';
import {useRegularSale} from '@forest-feed/hooks/useRegularSale';
import {useCreateCampaign} from '@forest-feed/redux/module/campaign/createCampaign';
import {showToast, ToastType} from '@forest-feed/utils/showToast';
import {useRouter} from '@forest-feed/lib/router-events';
import {colors} from 'colors';

export function SubmissionStatusStep() {
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const [error, setError] = useState(false);

  const router = useRouter();

  const {data: activeProfile} = useActiveProfile();
  const {data: publicationQueryData} = useQuery(publicationIds, {
    variables: publicationIdsVariables(activeProfile?.id as ProfileId, 1),
    context: {clientName: 'lens'},
  });

  const {campaignJourney, dispatchResetCampaignJourney} = useCampaignJourney();
  const {dispatchCreateCampaign} = useCreateCampaign();

  const salePrice = useRegularSale();
  const amount = useMemo(() => campaignJourney.size * Number(salePrice?.toString()), [campaignJourney.size, salePrice]);

  const handleErrorInProcess = useCallback(() => {
    setError(true);
    setLoading(false);
  }, []);

  const handleSuccessDeposit = useCallback(() => {
    setActiveStep(4);
  }, []);

  const handleSuccessApproveDai = useCallback(() => {
    setActiveStep(3);
  }, []);

  const handleSuccessCreateCampaign = useCallback(() => {
    setActiveStep(5);
    setLoading(false);
    showToast({
      title: 'newCampaign.goodJob',
      message: 'newCampaign.succeed',
      type: ToastType.success,
      translate: true,
    });
    router.push('/my-campaigns');
    dispatchResetCampaignJourney();
  }, [dispatchResetCampaignJourney, router]);

  const [depositMethod, isDepositReady] = useDepositToForestFeed({
    onSuccess: handleSuccessDeposit,
    enabled: activeStep === 3,
    onError: handleErrorInProcess,
    onPrepareError: handleErrorInProcess,
    amount,
  });

  const [approveDaiMethod, isApproveReady] = useApproveDai({
    onSuccess: handleSuccessApproveDai,
    onError: handleErrorInProcess,
    onPrepareError: handleErrorInProcess,
    amount,
  });

  const handleStartCreateCampaign = useCallback(
    (byUser: boolean = false) => {
      if (byUser) {
        setLoading(true);
        setError(false);
      }
      if (activeStep === 1) {
        setActiveStep(2);
      }
      if (activeStep === 2 && isApproveReady) {
        approveDaiMethod?.();
      }
      if (activeStep === 3 && isDepositReady) {
        depositMethod?.();
      }
      if (activeStep === 4) {
        console.log(
          {
            title: campaignJourney.content,
            minFollower: campaignJourney.reward.minimumFollowerNumber,
            isFollowerOnly: campaignJourney.reward.onlyFollowers,
            campaignSize: campaignJourney.size,
            publicationId: publicationQueryData?.publications?.items?.[0]?.id,
          },
          'body',
        );
        dispatchCreateCampaign({
          title: campaignJourney.content,
          minFollower: campaignJourney.reward.minimumFollowerNumber,
          isFollowerOnly: campaignJourney.reward.onlyFollowers,
          campaignSize: campaignJourney.size,
          publicationId: publicationQueryData?.publications?.items[0]?.id,
          onSuccess: handleSuccessCreateCampaign,
          onFailure: handleErrorInProcess,
        });
      }
    },
    [
      activeStep,
      approveDaiMethod,
      campaignJourney.content,
      campaignJourney.reward.minimumFollowerNumber,
      campaignJourney.reward.onlyFollowers,
      campaignJourney.size,
      depositMethod,
      dispatchCreateCampaign,
      handleErrorInProcess,
      handleSuccessCreateCampaign,
      isApproveReady,
      isDepositReady,
      publicationQueryData,
    ],
  );

  useEffect(() => {
    showToast({
      title: 'Is it correct?',
      message: publicationQueryData?.publications?.items?.[0].metadata?.content,
      type: ToastType.info,
      translate: false,
    });
  }, [publicationQueryData]);

  useEffect(() => {
    handleStartCreateCampaign();
  }, [activeStep, isDepositReady, isApproveReady]);

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
          <Button
            text={t('tryAgain')}
            onClick={() => handleStartCreateCampaign(true)}
            variant={ButtonVariant.secondary}
          />
        </div>
      </RenderIf>
    </div>
  );
}
