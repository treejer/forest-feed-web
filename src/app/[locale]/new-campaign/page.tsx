'use client';

import React, {useCallback, useMemo, useState} from 'react';

import {useTranslations} from 'use-intl';
import {motion} from 'framer-motion';

import {AnimatedPage} from '@forest-feed/components/kit/Animated/AnimatedPage';
import {Stepper} from '@forest-feed/components/kit/Stepper';
import {TreeCost} from '@forest-feed/components/TreeCost/TreeCost';
import {GeneralInfoStep, GeneralInfoStepState} from '@forest-feed/components/NewCampaignStepper/GeneralInfoStep';
import {PledgeStep, PledgeStepState} from '@forest-feed/components/NewCampaignStepper/PledgeStep';
import {useCampaignJourney} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import {AuthWrapper} from '@forest-feed/components/AuthWrapper/AuthWrapper';

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
  } = useCampaignJourney();

  const [campaignSize, setCampaignSize] = useState<number>(campaignJourney?.size || 1);

  const t = useTranslations('newCampaign.stepper');

  const handleApproveGeneralInfo = useCallback(
    (generalInfo: GeneralInfoStepState) => {
      dispatchApproveGeneralInfo(generalInfo);
    },
    [dispatchApproveGeneralInfo],
  );

  const handleApproveReview = useCallback(() => {
    dispatchSetCurrentStep(3);
  }, [dispatchSetCurrentStep]);

  const handleApprovePledge = useCallback(
    (pledgeState: PledgeStepState) => {
      dispatchApprovePledge(pledgeState);
    },
    [dispatchApprovePledge],
  );

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
      <AuthWrapper className="grid grid-cols-6 gap-10 h-full">
        <div className="col-span-5">
          <Stepper
            isDependent
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
                    key="general-info-form"
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
                  <GeneralInfoStep
                    defaultValues={generalInfoState}
                    isConfirm
                    activeStep={campaignJourney.currentStep}
                    setActiveStep={dispatchSetCurrentStep}
                    onProceed={handleApproveReview}
                    key="general-info-preview"
                  />
                ),
                title: t('confirm'),
              },
              {
                content: <div>Step 4</div>,
                title: t('share'),
              },
            ]}
          />
        </div>
        <motion.div
          initial={{x: 100, opacity: 0}}
          animate={{x: 0, opacity: 1}}
          exit={{x: 100, opacity: 0}}
          transition={{duration: 0.5}}
          className="col-span-1"
        >
          <TreeCost treeCount={campaignSize} />
        </motion.div>
      </AuthWrapper>
    </AnimatedPage>
  );
}

export default NewCampaignPage;
