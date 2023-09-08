'use client';

import React, {useCallback, useEffect, useMemo} from 'react';

import {useQuery} from '@apollo/client';
import {ProfileId, ProfileOwnedByMe} from '@lens-protocol/react-web';
import {CheckIcon, XIcon} from '@heroicons/react/solid';
import {Circles} from 'react-loader-spinner';
import {useTranslations} from 'use-intl';

import {useRouter} from '@forest-feed/lib/router-events';
import {useApproveDai} from '@forest-feed/hooks/useApproveDai';
import {useDepositToForestFeed} from '@forest-feed/hooks/useDepositToForestFeed';
import {useRegularSale} from '@forest-feed/hooks/useRegularSale';
import {useCreateCampaign} from '@forest-feed/redux/module/campaign/createCampaign';
import {useTokens} from '@forest-feed/redux/module/tokens/tokens.slice';
import {usePersistState} from '@forest-feed/hooks/usePersistState';
import {useCampaignJourney} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {publicationIds, publicationIdsVariables} from '@forest-feed/constants/graphQl/publicationIds';
import {showToast, ToastType} from '@forest-feed/utils/showToast';
import {colors} from 'colors';

export type SubmissionStatusStepProps = {
  activeProfile: ProfileOwnedByMe;
  onCreatePost: () => void;
  createPostLoading: boolean;
};

export function SubmissionStatusStep(props: SubmissionStatusStepProps) {
  const {onCreatePost, createPostLoading, activeProfile} = props;

  const {
    campaignJourney: {submissionLoading, submissionError, submissionActiveStep, ...campaignJourney},
    dispatchSetSubmissionState,
    dispatchCancelCampaignCreation,
  } = useCampaignJourney();

  const [title, setTitle] = usePersistState<string>('', 'CAMPAIGN_TITLE');
  const [titleError, setTitleError] = usePersistState<boolean>(false, 'CAMPAIGN_TITLE_ERROR');

  const router = useRouter();

  const {data: publicationQueryData, refetch} = useQuery(publicationIds, {
    variables: publicationIdsVariables(activeProfile?.id as ProfileId, 1),
    context: {clientName: 'lens'},
  });

  const {dispatchCheckBalance} = useTokens({
    didMount: false,
  });

  const {dispatchCreateCampaign} = useCreateCampaign();

  const {contractValue} = useRegularSale();
  const amount = useMemo(
    () => campaignJourney.size * Number(contractValue?.toString()),
    [campaignJourney.size, contractValue],
  );

  const handleErrorInProcess = useCallback(() => {
    dispatchSetSubmissionState({
      loading: false,
      error: true,
    });
  }, [dispatchSetSubmissionState]);

  const handleSuccessDeposit = useCallback(() => {
    dispatchCheckBalance();
    dispatchSetSubmissionState({
      loading: false,
      activeStep: 3,
    });
  }, [dispatchCheckBalance, dispatchSetSubmissionState]);

  const handleSuccessApproveDai = useCallback(() => {
    dispatchSetSubmissionState({
      activeStep: 2,
    });
  }, [dispatchSetSubmissionState]);

  const handleSuccessCreateCampaign = useCallback(() => {
    setTitle('');
    router.push('/my-campaigns');
  }, [router, setTitle]);

  const [approveDaiMethod, isApproveReady] = useApproveDai({
    onTxSuccess: handleSuccessApproveDai,
    enabled: !!contractValue,
    onContractWriteError: handleErrorInProcess,
    onPrepareError: handleErrorInProcess,
    amount,
  });

  const [depositMethod, isDepositReady] = useDepositToForestFeed({
    onTxSuccess: handleSuccessDeposit,
    enabled: submissionActiveStep === 2,
    onContractWriteError: handleErrorInProcess,
    onPrepareError: handleErrorInProcess,
    amount,
  });

  const handleConfirmTitle = useCallback(() => {
    if (!title) {
      setTitleError(true);
      return;
    }
    dispatchSetSubmissionState({
      loading: true,
    });
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
    title,
    dispatchSetSubmissionState,
    dispatchCreateCampaign,
    campaignJourney.reward.minimumFollowerNumber,
    campaignJourney.reward.onlyFollowers,
    campaignJourney.size,
    publicationQueryData?.publications?.items,
    handleSuccessCreateCampaign,
    handleErrorInProcess,
    setTitleError,
  ]);

  const handleStartCreateCampaign = useCallback(
    (byUser: boolean = false) => {
      if (byUser) {
        dispatchSetSubmissionState({
          loading: true,
          error: false,
        });
        if (submissionActiveStep === 0) {
          onCreatePost();
        }
        if (submissionActiveStep === 3) {
          handleConfirmTitle();
        }
      }
      if (submissionActiveStep === 1 && isApproveReady) {
        (async () => {
          await refetch();
        })();
        approveDaiMethod?.();
      }
      if (submissionActiveStep === 2 && isDepositReady) {
        (async () => {
          await refetch();
        })();
        depositMethod?.();
      }
    },
    [
      submissionActiveStep,
      isApproveReady,
      isDepositReady,
      dispatchSetSubmissionState,
      onCreatePost,
      handleConfirmTitle,
      approveDaiMethod,
      refetch,
      depositMethod,
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
    if (!submissionError) {
      handleStartCreateCampaign();
    }
  }, [submissionActiveStep, isDepositReady, isApproveReady]);

  const handleCancelSubmission = useCallback(() => {
    dispatchCancelCampaignCreation();
    setTitle('');
    setTitleError(false);
  }, [dispatchCancelCampaignCreation, setTitle, setTitleError]);

  const t = useTranslations('newCampaign');

  const steps = useMemo(
    () => [
      {
        key: 0,
        text: 'createOnLens',
        desc: 'createOnLensDesc',
      },
      {
        key: 1,
        text: 'approveDai',
        desc: 'approveDaiDesc',
      },
      {
        key: 2,
        text: 'deposit',
        desc: 'depositDesc',
      },
      {
        key: 3,
        text: 'finalize',
        desc: 'finalizeDesc',
      },
    ],
    [],
  );

  return (
    <div>
      <div className="mb-5">
        <p className="text-lg md:text-xl font-bold">
          {t(submissionError ? 'oops' : submissionActiveStep === 0 && !submissionLoading ? 'createPost' : 'processing')}
        </p>
        <p className={`text-sm font-light ${submissionError ? 'text-red' : 'text-secondary'}`}>
          {t(
            submissionError
              ? 'failText'
              : submissionActiveStep === 0 && !submissionLoading
              ? 'pleaseSubmit'
              : 'bePatient',
          )}
        </p>
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <ul>
          {steps.map(step => (
            <li key={step.key} className="flex items-center mb-2">
              <div className="p-1">
                <div
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex justify-center items-center border-2 ${
                    submissionActiveStep == step.key && submissionLoading
                      ? `${
                          step.key === submissionActiveStep && submissionError
                            ? 'border-red'
                            : 'border-l-green border-r-green  border-t-border  border-b-border '
                        }${submissionLoading ? 'animate-spin' : ''}`
                      : step.key < submissionActiveStep
                      ? 'border-green'
                      : step.key === submissionActiveStep && submissionError
                      ? 'border-red'
                      : 'border-border'
                  }`}
                >
                  {step.key < submissionActiveStep ? (
                    <CheckIcon className="w-3 h-3 md:w-5 md:h-5 text-green" />
                  ) : step.key === submissionActiveStep && submissionError ? (
                    <XIcon className="w-3 h-3 md:w-5 md:h-5 text-red" />
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
                  {!submissionError && !submissionLoading && submissionActiveStep === 3 && step.key === 3 ? (
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
            visible={submissionLoading}
          />
        </div>
      </div>
      <RenderIf condition={!submissionError && submissionActiveStep === 0}>
        <Spacer times={5} />
        <div className="flex justify-end items-center">
          <Button
            text={t('submit')}
            onClick={onCreatePost}
            loading={createPostLoading || submissionLoading}
            disabled={createPostLoading || submissionLoading}
            variant={ButtonVariant.secondary}
          />
        </div>
      </RenderIf>
      <RenderIf condition={submissionError || (submissionActiveStep === 3 && !submissionLoading)}>
        <Spacer times={5} />
        <div className="flex justify-end items-center">
          {submissionError ? (
            <>
              <Button text={t('cancel')} onClick={handleCancelSubmission} variant={ButtonVariant.primary} />
              <Spacer />
              <Button
                text={t('tryAgain')}
                onClick={() => handleStartCreateCampaign(true)}
                variant={ButtonVariant.secondary}
              />
            </>
          ) : (
            <Button text={t('submit')} onClick={handleConfirmTitle} variant={ButtonVariant.secondary} />
          )}
        </div>
      </RenderIf>
    </div>
  );
}
