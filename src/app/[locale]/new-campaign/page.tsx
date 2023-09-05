'use client';

import React, {useCallback, useEffect, useMemo} from 'react';

import {useTranslations} from 'use-intl';
import {motion} from 'framer-motion';
import {ProfileOwnedByMe, useActiveProfile} from '@lens-protocol/react-web';

import {AnimatedPage} from '@forest-feed/components/kit/Animated/AnimatedPage';
import {Stepper} from '@forest-feed/components/kit/Stepper';
import {TreeCost} from '@forest-feed/components/TreeCost/TreeCost';
import {GeneralInfoStep} from '@forest-feed/components/NewCampaignStepper/GeneralInfoStep';
import {PledgeStep, PledgeStepState} from '@forest-feed/components/NewCampaignStepper/PledgeStep';
import {
  CampaignJourneyAction,
  useCampaignJourney,
} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import {AuthWrapper} from '@forest-feed/components/AuthWrapper/AuthWrapper';
import {useLensCreatePost} from '@forest-feed/hooks/useLensCreatePost';
import {SubmissionStatusStep} from '@forest-feed/components/NewCampaignStepper/SubmissionStatusStep';
import {PreviewStep} from '@forest-feed/components/NewCampaignStepper/PreviewStep';
import {useTokens} from '@forest-feed/redux/module/tokens/tokens.slice';
import {usePersistState} from '@forest-feed/hooks/usePersistState';

function NewCampaignPage() {
  const {
    campaignJourney,
    dispatchApproveGeneralInfo,
    dispatchApprovePledge,
    dispatchSetCurrentStep,
    dispatchSetMinimumFollowerNumber,
    dispatchSetOnlyFollowers,
    dispatchSetCanBeCollectedOnlyFollowers,
    dispatchSetCanBeCollected,
    dispatchSetCampaignSize,
  } = useCampaignJourney();

  const [campaignSize, setCampaignSize, debouncedCampaignSize] = usePersistState<number>(
    campaignJourney?.size || 1,
    'CAMPAIGN_SIZE',
  );

  useEffect(() => {
    dispatchSetCampaignSize(debouncedCampaignSize);
  }, [debouncedCampaignSize]);

  const {data: activeProfile} = useActiveProfile();

  const {createLensPost, allLoading: createPostLoading} = useLensCreatePost({
    publisher: activeProfile as ProfileOwnedByMe,
  });

  const t = useTranslations('newCampaign.stepper');

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
      await createLensPost();
    } catch (e: any) {
      console.log(e, 'error in handle approve review');
    }
  }, [createLensPost]);

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

  return (
    <AnimatedPage className="h-full">
      <AuthWrapper className="grid grid-cols-6 gap-y-5 md:gap-10 h-full">
        <div className="col-span-6 md:col-span-5">
          <Stepper
            isDependent
            disabled={createPostLoading}
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
                    campaignSize={campaignSize}
                    setCampaignSize={setCampaignSize}
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
                    activeProfile={activeProfile}
                    generalInfo={generalInfoState}
                    loading={createPostLoading}
                    activeStep={campaignJourney.currentStep}
                    setActiveStep={dispatchSetCurrentStep}
                    onApprove={handleApproveReview}
                    disabled={tokensLoading || campaignJourney.disableForm}
                  />
                ),
                title: t('review'),
              },
              {
                content: <SubmissionStatusStep />,
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
          className="row-start-1 md:row-auto col-span-6 md:col-span-1"
        >
          <TreeCost treeCount={campaignSize} />
        </motion.div>
      </AuthWrapper>
    </AnimatedPage>
  );
}

export default NewCampaignPage;
