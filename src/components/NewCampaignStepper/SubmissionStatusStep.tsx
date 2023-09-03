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
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);

  const router = useRouter();

  const {data: activeProfile} = useActiveProfile();
  const {data: publicationQueryData} = useQuery(publicationIds, {
    variables: publicationIdsVariables(activeProfile?.id as ProfileId, 1),
    context: {clientName: 'lens'},
  });

  console.log(publicationQueryData);

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
    setLoading(false);
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

  const [approveDaiMethod, isApproveReady, approveTxSucceed] = useApproveDai({
    onSuccess: handleSuccessApproveDai,
    enabled: !!salePrice,
    onError: handleErrorInProcess,
    onPrepareError: handleErrorInProcess,
    amount,
  });

  const [depositMethod, isDepositReady, depositTxSucceed] = useDepositToForestFeed({
    onSuccess: handleSuccessDeposit,
    enabled: activeStep === 3 && approveTxSucceed,
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
    },
    [activeStep, approveDaiMethod, depositMethod, isApproveReady, isDepositReady],
  );

  const handleConfirmTitle = useCallback(() => {
    console.log(title, 'title');
    if (!title) {
      setTitleError(true);
      return;
    }
    setLoading(true);
    console.log(
      {
        title,
        minFollower: campaignJourney.reward.minimumFollowerNumber,
        isFollowerOnly: campaignJourney.reward.onlyFollowers,
        campaignSize: campaignJourney.size,
        publicationId: publicationQueryData?.publications?.items?.[0]?.id,
      },
      'body',
    );
    dispatchCreateCampaign({
      title,
      minFollower: campaignJourney.reward.minimumFollowerNumber,
      isFollowerOnly: campaignJourney.reward.onlyFollowers,
      campaignSize: campaignJourney.size,
      publicationId: publicationQueryData?.publications?.items[0]?.id,
      onSuccess: handleSuccessCreateCampaign,
      onFailure: handleErrorInProcess,
    });
  }, [
    campaignJourney.reward.minimumFollowerNumber,
    campaignJourney.reward.onlyFollowers,
    campaignJourney.size,
    dispatchCreateCampaign,
    handleErrorInProcess,
    handleSuccessCreateCampaign,
    publicationQueryData?.publications?.items,
    title,
  ]);

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
  }, [activeStep, isDepositReady, isApproveReady, depositTxSucceed]);

  const t = useTranslations('newCampaign');

  const steps = useMemo(
    () => [
      {
        key: 1,
        text: 'createOnLens',
        desc: 'createOnLensDesc',
      },
      {
        key: 2,
        text: 'approveDai',
        desc: 'approveDaiDesc',
      },
      {
        key: 3,
        text: 'deposit',
        desc: 'depositDesc',
      },
      {
        key: 4,
        text: 'finalize',
        desc: 'finalizeDesc',
      },
    ],
    [],
  );

  return (
    <div>
      <div className="mb-5">
        <p className="text-lg md:text-xl font-bold">{t(error ? 'oops' : 'processing')}</p>
        <p className={`text-sm font-light ${error ? 'text-red' : 'text-secondary'}`}>
          {t(error ? 'failText' : 'bePatient')}
        </p>
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <ul>
          {steps.map(step => (
            <li key={step.key} className="flex items-center mb-2">
              <div className="p-1">
                <div
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex justify-center items-center border-2 ${
                    activeStep == step.key && loading
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
                    <CheckIcon className="w-3 h-3 md:w-5 md:h-5 text-green" />
                  ) : step.key === activeStep && error ? (
                    <XMarkIcon className="w-3 h-3 md:w-5 md:h-5 text-red" />
                  ) : (
                    ''
                  )}
                </div>
              </div>

              <Spacer />
              <div>
                <p className="text-sm md:text-base">{t(step.text)}</p>
                <div className="flex items-center">
                  <p className="text-[12px] md:text-sm text-secondary text-align">{t(step.desc)}</p>
                  {!error && !loading && activeStep === 4 && step.key === 4 ? (
                    <div className="flex flex-col relative">
                      <input
                        className="border border-border outline-none p-1 rounded-[5px] ml-2 text-green"
                        type="text"
                        value={title}
                        onFocus={() => setTitleError(false)}
                        onChange={e => setTitle(e.target.value)}
                      />
                      {titleError ? (
                        <span className="text-[12px] md:text-sm text-red ml-2 absolute -bottom-5 left-2">
                          {t('titleError')}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-center mt-3 md:mt-0 md:block">
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
      <RenderIf condition={error || activeStep === 4}>
        <div className="flex justify-end items-center mt-10">
          {error ? (
            <>
              <Button text={t('cancel')} variant={ButtonVariant.primary} />
              <Spacer />
              <Button
                text={t('tryAgain')}
                onClick={() => handleStartCreateCampaign(true)}
                variant={ButtonVariant.secondary}
              />
            </>
          ) : (
            <Button text={t('confirm')} onClick={handleConfirmTitle} variant={ButtonVariant.secondary} />
          )}
        </div>
      </RenderIf>
    </div>
  );
}
