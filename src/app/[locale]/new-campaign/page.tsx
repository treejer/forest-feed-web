'use client';

import React, {useCallback, useMemo} from 'react';

import dynamic from 'next/dynamic';
import {motion} from 'framer-motion';
import {Hearts} from 'react-loader-spinner';

const AnimatedPage = dynamic(() => import('@forest-feed/components/kit/Animated/AnimatedPage'), {
  loading: () => (
    <div className={cn('flex w-full h-full justify-center items-center')}>
      <Hearts />
    </div>
  ),
  ssr: true,
});
import Stepper from '@forest-feed/components/kit/Stepper';
import TreeCost from '@forest-feed/components/TreeCost/TreeCost';
import GeneralInfoStep from '@forest-feed/components/NewCampaignStepper/GeneralInfoStep';
import PledgeStep from '@forest-feed/components/NewCampaignStepper/PledgeStep';
import type {CampaignJourneyAction} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import useCampaignJourney from '@forest-feed/hooks/useCampaignJourney';
import AuthWrapper from '@forest-feed/components/AuthWrapper/AuthWrapper';
import useLensCreatePost from '@forest-feed/hooks/useLensCreatePost';
import SubmissionStatusStep from '@forest-feed/components/NewCampaignStepper/SubmissionStatusStep';
import PreviewStep from '@forest-feed/components/NewCampaignStepper/PreviewStep';
import useTokens from '@forest-feed/hooks/useToken';
import {useScopedI18n} from '@forest-feed/locales/client';
import useWeb3 from '@forest-feed/hooks/useWeb3';
import cn from '@forest-feed/utils/tailwind';

function NewCampaignPage() {
  const {
    campaignJourney,
    dispatchSetSubmissionState,
    dispatchApproveGeneralInfo,
    dispatchApprovePledge,
    dispatchSetCurrentStep,
    dispatchSetMinimumFollowerNumber,
    dispatchSetOnlyFollowers,
    dispatchSetCanBeCollectedOnlyFollowers,
    dispatchSetCanBeCollected,
    dispatchSetCampaignSize,
  } = useCampaignJourney();

  const {
    web3: {lensProfile},
  } = useWeb3();

  const {createLensPost, allLoading: createPostLoading, createdPubId, setCreatedPubId} = useLensCreatePost();

  const t = useScopedI18n('newCampaign.stepper');

  const {
    tokens: {loading: tokensLoading},
  } = useTokens({
    didMount: false,
  });

  const handleApproveGeneralInfo = useCallback(
    (generalInfo: CampaignJourneyAction['approveGeneralInfo']) => {
      dispatchApproveGeneralInfo(generalInfo);
    },
    [dispatchApproveGeneralInfo],
  );

  const handleApproveReview = useCallback(async () => {
    try {
      dispatchSetCurrentStep(3);
      dispatchSetSubmissionState({
        activeStep: 0,
        error: false,
      });
    } catch (e: any) {
      console.log(e, 'error in handle approve review');
    }
  }, [dispatchSetCurrentStep, dispatchSetSubmissionState]);

  const handleApprovePledge = useCallback(() => {
    dispatchApprovePledge();
  }, [dispatchApprovePledge]);

  const generalInfoState = useMemo(
    () => ({
      content: campaignJourney.content,
      image: campaignJourney.image,
      termsConditionAgreed: campaignJourney.termsConditionAgreed,
    }),
    [campaignJourney.content, campaignJourney.image, campaignJourney.termsConditionAgreed],
  );

  const pledgeState = useMemo(
    () => ({
      size: campaignJourney.size,
      reward: campaignJourney.reward,
      settings: campaignJourney.settings,
    }),
    [campaignJourney.size, campaignJourney.reward, campaignJourney.settings],
  );

  const disabledStepper = useMemo(
    () =>
      createPostLoading ||
      campaignJourney.submissionLoading ||
      (campaignJourney.currentStep === 3 && campaignJourney.submissionActiveStep > 0),
    [
      campaignJourney.currentStep,
      campaignJourney.submissionActiveStep,
      campaignJourney.submissionLoading,
      createPostLoading,
    ],
  );

  return (
    <AnimatedPage className={cn('h-full')}>
      <AuthWrapper className={cn('grid grid-cols-6 gap-y-5 md:gap-10 h-full')}>
        <div className={cn('col-span-6 md:col-span-5')}>
          <Stepper
            isDependent
            disabled={disabledStepper}
            activeStep={campaignJourney.currentStep}
            setActiveStep={dispatchSetCurrentStep}
            contents={[
              {
                content: (
                  <GeneralInfoStep
                    defaultValues={generalInfoState}
                    isConfirm={false}
                    activeStep={campaignJourney.currentStep}
                    setActiveStep={dispatchSetCurrentStep}
                    onProceed={handleApproveGeneralInfo}
                  />
                ),
                title: t('generalInfo'),
              },
              {
                content: (
                  <PledgeStep
                    setCampaignSize={dispatchSetCampaignSize}
                    setCanBeCollected={dispatchSetCanBeCollected}
                    setCanBeCollectedOnlyFollowers={dispatchSetCanBeCollectedOnlyFollowers}
                    setMinimumFollowerNumber={dispatchSetMinimumFollowerNumber}
                    setOnlyFollowers={dispatchSetOnlyFollowers}
                    values={pledgeState}
                    activeStep={campaignJourney.currentStep}
                    setActiveStep={dispatchSetCurrentStep}
                    onProceed={handleApprovePledge}
                  />
                ),
                title: t('pledge'),
              },
              {
                content: (
                  <PreviewStep
                    activeProfile={lensProfile}
                    generalInfo={generalInfoState}
                    activeStep={campaignJourney.currentStep}
                    setActiveStep={dispatchSetCurrentStep}
                    onApprove={handleApproveReview}
                    disabled={tokensLoading || campaignJourney.disableForm}
                  />
                ),
                title: t('review'),
              },
              {
                content: (
                  <SubmissionStatusStep
                    onCreatePost={createLensPost}
                    createPostLoading={createPostLoading}
                    createdPubId={createdPubId}
                    setCreatedPubId={setCreatedPubId}
                  />
                ),
                title: t('finalize'),
              },
            ]}
          />
        </div>
        <motion.div
          initial={{x: 100, opacity: 0}}
          animate={{x: 0, opacity: 1}}
          exit={{x: 100, opacity: 0}}
          transition={{duration: 0.5}}
          className={cn('row-start-1 md:row-auto col-span-6 md:col-span-1')}
        >
          <TreeCost treeCount={campaignJourney.size} />
        </motion.div>
      </AuthWrapper>
    </AnimatedPage>
  );
}

export default NewCampaignPage;
