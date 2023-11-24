'use client';

import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {CheckIcon, XMarkIcon} from '@heroicons/react/24/solid';
import {Circles} from 'react-loader-spinner';
import {BigNumberish} from 'ethers';

import {useRouter} from '@forest-feed/lib/router-events';
import useApproveDai from '@forest-feed/hooks/useApproveDai';
import useDepositToForestFeed from '@forest-feed/hooks/useDepositToForestFeed';
import useRegularSale from '@forest-feed/hooks/useRegularSale';
import usePersistState from '@forest-feed/hooks/usePersistState';
import useAllowanceDaiInForestFeed from '@forest-feed/hooks/useAllowanceDaiInForestFeed';
import Button, {ButtonVariant} from '@forest-feed/components/kit/Button';
import Spacer from '@forest-feed/components/common/Spacer';
import RenderIf from '@forest-feed/components/common/RenderIf';
import CountDownTimer from '@forest-feed/components/CountDownTimer/CountDownTimer';
import useCampaignJourney from '@forest-feed/hooks/useCampaignJourney';
import useTokens from '@forest-feed/hooks/useToken';
import useCreateCampaign from '@forest-feed/hooks/useCreateCampaign';
import cn from '@forest-feed/utils/tailwind';
import colors from 'colors';
import {storageKeys, SubmitCampaignSteps} from '@forest-feed/config';
import {useScopedI18n} from '@forest-feed/locales/client';

export type SubmissionStatusStepProps = {
  createdPubId: string | null;
  setCreatedPubId: React.Dispatch<React.SetStateAction<string | null>>;
  onCreatePost: () => void;
  createPostLoading: boolean;
};

export default function SubmissionStatusStep(props: SubmissionStatusStepProps) {
  const {createPostLoading, createdPubId, setCreatedPubId, onCreatePost} = props;

  const {
    campaignJourney: {submissionLoading, submissionError, submissionActiveStep, ...campaignJourney},
    dispatchSetSubmissionState,
    dispatchCancelCampaignCreation,
  } = useCampaignJourney();

  const [_allowanceChecked, setAllowanceChecked] = useState(false);
  const [submitPressed, setSubmitPressed] = useState(false);

  const [title, setTitle] = usePersistState<string>('', storageKeys.CAMPAIGN_TITLE);
  const [titleError, setTitleError] = usePersistState<boolean>(false, storageKeys.CAMPAIGN_TITLE_ERROR);

  const [_approveSucceed, setApproveSucceed] = usePersistState<boolean>(false, storageKeys.CAMPAIGN_APPROVE_SUCCEED);
  const [depositTime, setDepositTime] = usePersistState<Date | null>(null, storageKeys.CAMPAIGN_DEPOSIT_SUCCEED);
  const [delay, setDelay] = usePersistState<boolean>(true, storageKeys.CAMPAIGN_DELAY);

  const router = useRouter();

  const {dispatchCheckBalance} = useTokens({
    didMount: false,
  });

  const {dispatchCreateCampaign} = useCreateCampaign();

  const {contractValue: salePriceBigNum} = useRegularSale();
  const amount = useMemo(
    () => campaignJourney.size * Number(salePriceBigNum?.toString()),
    [campaignJourney.size, salePriceBigNum],
  );

  const handleErrorInProcess = useCallback(() => {
    dispatchSetSubmissionState({
      loading: false,
      error: true,
    });
  }, [dispatchSetSubmissionState]);

  const handlePrepareSuccessDeposit = useCallback(() => {
    dispatchSetSubmissionState({
      error: false,
      activeStep: SubmitCampaignSteps.Deposit,
      loading: true,
    });
  }, [dispatchSetSubmissionState]);

  const handleSuccessDeposit = useCallback(() => {
    dispatchCheckBalance();
    setDepositTime(new Date());
    dispatchSetSubmissionState({
      error: false,
      loading: false,
      activeStep: SubmitCampaignSteps.Finalize,
    });
  }, [setDepositTime, dispatchCheckBalance, dispatchSetSubmissionState]);

  const handlePrepareSuccessApproveDai = useCallback(() => {
    dispatchSetSubmissionState({
      error: false,
      activeStep: SubmitCampaignSteps.Approve,
      loading: true,
    });
  }, [dispatchSetSubmissionState]);

  const handleSuccessApproveDai = useCallback(() => {
    setApproveSucceed(true);
    dispatchSetSubmissionState({
      error: false,
      activeStep: SubmitCampaignSteps.PrepareDeposit,
      loading: true,
    });
  }, [dispatchSetSubmissionState, setApproveSucceed]);

  const handleSuccessAllowance = useCallback(
    (_: BigNumberish, value: number) => {
      setAllowanceChecked(true);
      if (value >= amount / 1e18) {
        setApproveSucceed(true);
        dispatchSetSubmissionState({
          error: false,
          activeStep: SubmitCampaignSteps.PrepareDeposit,
          loading: true,
        });
      } else {
        dispatchSetSubmissionState({
          error: false,
          activeStep: SubmitCampaignSteps.PrepareApprove,
          loading: true,
        });
      }
    },
    [amount, dispatchSetSubmissionState, setApproveSucceed],
  );

  const handleSuccessCreateCampaign = useCallback(() => {
    setTitle('');
    setDelay(true);
    setTitleError(false);
    setDepositTime(null);
    setApproveSucceed(false);
    setSubmitPressed(false);
    setCreatedPubId(null);
    router.push('/my-campaigns');
  }, [setTitle, setDelay, setTitleError, setDepositTime, setApproveSucceed, setCreatedPubId, router]);

  useAllowanceDaiInForestFeed({
    onSuccess: handleSuccessAllowance,
    onError: handleErrorInProcess,
    enabled: submissionActiveStep === SubmitCampaignSteps.CheckAllowance,
  });

  const [approveDaiMethod] = useApproveDai({
    onTxSuccess: handleSuccessApproveDai,
    onPrepareSuccess: handlePrepareSuccessApproveDai,
    enabled: submissionActiveStep === SubmitCampaignSteps.PrepareApprove,
    onContractWriteError: handleErrorInProcess,
    onPrepareError: handleErrorInProcess,
    amount,
  });

  const [depositMethod] = useDepositToForestFeed({
    onTxSuccess: handleSuccessDeposit,
    enabled: submissionActiveStep === SubmitCampaignSteps.PrepareDeposit,
    onPrepareSuccess: handlePrepareSuccessDeposit,
    onContractWriteError: handleErrorInProcess,
    onPrepareError: handleErrorInProcess,
    amount,
  });

  const handleConfirmTitle = useCallback(() => {
    if (!title || !createdPubId) {
      setTitleError(true);
      return;
    }
    dispatchSetSubmissionState({
      error: false,
      loading: true,
    });
    dispatchCreateCampaign({
      title,
      minFollower: campaignJourney.reward.minimumFollowerNumber,
      isFollowerOnly: campaignJourney.reward.onlyFollowers,
      campaignSize: campaignJourney.size,
      publicationId: createdPubId,
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
    createdPubId,
    handleSuccessCreateCampaign,
    handleErrorInProcess,
    setTitleError,
  ]);

  const handleCreatePost = useCallback(() => {
    setSubmitPressed(true);
    onCreatePost();
  }, [onCreatePost]);

  const handleStartCreateCampaign = useCallback(
    (byUser: boolean = false) => {
      setSubmitPressed(true);
      if (byUser) {
        dispatchSetSubmissionState({
          loading: true,
          error: false,
        });
        if (submissionActiveStep === SubmitCampaignSteps.CreatePost) {
          onCreatePost();
        }
        if (submissionActiveStep === SubmitCampaignSteps.Finalize) {
          handleConfirmTitle();
        }
      }
      if (submissionActiveStep === SubmitCampaignSteps.Approve) {
        approveDaiMethod?.();
      }
      if (submissionActiveStep === SubmitCampaignSteps.Deposit) {
        depositMethod?.();
      }
    },
    [
      submissionActiveStep,
      dispatchSetSubmissionState,
      onCreatePost,
      handleConfirmTitle,
      approveDaiMethod,
      depositMethod,
    ],
  );

  useEffect(() => {
    if (!submissionError && submitPressed) {
      handleStartCreateCampaign();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionActiveStep]);

  useEffect(() => {
    return () => {
      dispatchSetSubmissionState({
        loading: false,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancelSubmission = useCallback(() => {
    dispatchCancelCampaignCreation();
    setTitle('');
    setTitleError(false);
    setDelay(true);
    setDepositTime(null);
    setApproveSucceed(false);
    setSubmitPressed(false);
    setCreatedPubId(null);
  }, [
    dispatchCancelCampaignCreation,
    setTitle,
    setTitleError,
    setDelay,
    setDepositTime,
    setApproveSucceed,
    setCreatedPubId,
  ]);

  const handleChangeTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    [setTitle],
  );

  const handleFocusInput = useCallback(() => {
    setTitleError(false);
  }, [setTitleError]);

  const handleEndTime = useCallback(() => {
    setDelay(false);
  }, [setDelay]);

  const t = useScopedI18n('newCampaign');

  const steps = useMemo(
    () => [
      {
        key: SubmitCampaignSteps.CreatePost,
        text: 'createOnLens',
        desc: 'createOnLensDesc',
      },
      {
        key: SubmitCampaignSteps.Approve,
        text: 'approveDai',
        desc: 'approveDaiDesc',
      },
      {
        key: SubmitCampaignSteps.Deposit,
        text: 'deposit',
        desc: 'depositDesc',
      },
      {
        key: SubmitCampaignSteps.Finalize,
        text: 'finalize',
        desc: 'finalizeDesc',
      },
    ],
    [],
  );

  const stepIcon = useCallback(
    (step: number) => {
      return step < submissionActiveStep ? (
        <CheckIcon className={cn('w-3 h-3 md:w-5 md:h-5 text-green')} />
      ) : step === submissionActiveStep && submissionError ? (
        <XMarkIcon className={cn('w-3 h-3 md:w-5 md:h-5 text-red')} />
      ) : (
        ''
      );
    },
    [submissionActiveStep, submissionError],
  );

  const stepDynamicClassNames = useCallback(
    (step: number) => {
      return submissionActiveStep == step && submissionLoading
        ? `${
            step === submissionActiveStep && submissionError
              ? 'border-red'
              : 'border-l-green border-r-green  border-t-border  border-b-border '
          }${submissionLoading ? 'animate-spin' : ''}`
        : step < submissionActiveStep
        ? 'border-green'
        : step === submissionActiveStep && submissionError
        ? 'border-red'
        : 'border-border';
    },
    [submissionActiveStep, submissionError, submissionLoading],
  );

  const titleCampaignInput = useCallback(
    (step: number) => {
      return !submissionError &&
        !submissionLoading &&
        submissionActiveStep === SubmitCampaignSteps.Finalize &&
        step === SubmitCampaignSteps.Finalize ? (
        <div className={cn('flex flex-col relative')}>
          <input
            className={cn('border border-border outline-none p-1 rounded-[5px] ml-2 text-green')}
            type="text"
            value={title}
            onFocus={handleFocusInput}
            onChange={handleChangeTitle}
          />
          {titleError ? (
            <span className={cn('text-xs md:text-sm text-red ml-2 absolute -bottom-5 left-2')}>{t('titleError')}</span>
          ) : null}
        </div>
      ) : null;
    },
    [
      handleChangeTitle,
      handleFocusInput,
      submissionActiveStep,
      submissionError,
      submissionLoading,
      t,
      title,
      titleError,
    ],
  );

  const submitTitleButton = useCallback(
    () =>
      delay && depositTime ? (
        <CountDownTimer start={depositTime?.toString()} deadline={41} onEndTime={handleEndTime} />
      ) : (
        t('submit')
      ),
    [depositTime, delay, t, handleEndTime],
  );

  const pageTitle = useMemo(
    () =>
      submissionError
        ? 'oops'
        : submissionActiveStep === SubmitCampaignSteps.CreatePost && !submissionLoading
        ? 'createPost'
        : !submitPressed
        ? 'continue'
        : 'processing',
    [submissionActiveStep, submissionError, submissionLoading, submitPressed],
  );

  const pageDesc = useMemo(
    () =>
      submissionError
        ? 'failText'
        : submissionActiveStep === SubmitCampaignSteps.CreatePost && !submissionLoading
        ? 'pleaseSubmit'
        : 'bePatient',
    [submissionActiveStep, submissionError, submissionLoading],
  );

  return (
    <div>
      <div className={cn('mb-5')}>
        <p className={cn('text-lg md:text-xl font-bold')}>{t(pageTitle)}</p>
        <p
          className={cn('text-sm font-light text-secondary', {
            'text-red': submissionError,
          })}
        >
          {t(pageDesc)}
        </p>
      </div>
      <div className={cn('flex flex-col md:flex-row md:items-center justify-between')}>
        <ul>
          {steps.map(step => (
            <li key={step.key} className={cn('flex items-center mb-2')}>
              <div className={cn('p-1')}>
                <div
                  className={cn(
                    'w-6 h-6 md:w-8 md:h-8 rounded-full flex justify-center items-center border-2',
                    stepDynamicClassNames(step.key),
                  )}
                >
                  {stepIcon(step.key)}
                </div>
              </div>
              <Spacer />
              <div>
                <p className={cn('text-sm md:text-base')}>{t(step.text as any)}</p>
                <div className={cn('flex items-center')}>
                  <p className={cn('text-xs md:text-sm text-secondary text-align')}>{t(step.desc as any)}</p>
                  {titleCampaignInput(step.key)}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className={cn('flex justify-center mt-3 md:mt-0 md:block')}>
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
      <RenderIf
        condition={
          !submissionError &&
          !submissionLoading &&
          !submitPressed &&
          [
            SubmitCampaignSteps.PrepareApprove,
            SubmitCampaignSteps.Approve,
            SubmitCampaignSteps.PrepareDeposit,
            SubmitCampaignSteps.Deposit,
          ].includes(submissionActiveStep)
        }
      >
        <div className={cn('flex flex-col items-end justify-center')}>
          <Button
            text={t('continue')}
            onClick={() => handleStartCreateCampaign(true)}
            variant={ButtonVariant.secondary}
          />
          <span className={cn('text-right text-red text-xs md:text-sm')}>{t('pleaseReject')}</span>
        </div>
      </RenderIf>
      <RenderIf condition={!submissionError && submissionActiveStep === SubmitCampaignSteps.CreatePost}>
        <Spacer times={5} />
        <div className={cn('flex justify-end items-center')}>
          <Button
            text={t('submit')}
            onClick={handleCreatePost}
            loading={createPostLoading || submissionLoading}
            disabled={createPostLoading || submissionLoading}
            variant={ButtonVariant.secondary}
          />
        </div>
      </RenderIf>
      <RenderIf
        condition={!submissionError && submissionActiveStep === SubmitCampaignSteps.Finalize && !submissionLoading}
      >
        <Spacer times={5} />
        <div className={cn('flex justify-end items-center')}>
          <Button text={t('cancel')} onClick={handleCancelSubmission} variant={ButtonVariant.primary} />
          <Spacer />
          <Button
            text={submitTitleButton()}
            loading={submissionLoading}
            disabled={submissionLoading || delay}
            onClick={handleConfirmTitle}
            variant={ButtonVariant.secondary}
          />
        </div>
      </RenderIf>
      <RenderIf condition={submissionError}>
        <Spacer times={5} />
        <div className={cn('flex justify-end items-center')}>
          <>
            <Button text={t('cancel')} onClick={handleCancelSubmission} variant={ButtonVariant.primary} />
            <Spacer />
            <Button
              text={t('tryAgain')}
              onClick={() => handleStartCreateCampaign(true)}
              variant={ButtonVariant.secondary}
            />
          </>
        </div>
      </RenderIf>
    </div>
  );
}
