'use client';

import React, {useCallback, useMemo, useState} from 'react';

import {useTranslations} from 'use-intl';
import {useAccount} from 'wagmi';
import {ConnectButton} from '@rainbow-me/rainbowkit';
import {motion} from 'framer-motion';

import {AnimatedPage} from '@forest-feed/components/kit/Animated/AnimatedPage';
import {Stepper} from '@forest-feed/components/kit/Stepper';
import {TreeCost} from '@forest-feed/components/TreeCost/TreeCost';
import {GeneralInfoStep, GeneralInfoStepState} from '@forest-feed/components/NewCampaignStepper/GeneralInfoStep';
import {PledgeStep, PledgeStepState} from '@forest-feed/components/NewCampaignStepper/PledgeStep';
import {useCampaignJourney} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';

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

  const {
    web3: {isSupportedNetwork},
  } = useWeb3();

  const {address, isConnected} = useAccount();

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
    <AnimatedPage className="grid grid-cols-6 gap-4">
      {address && isConnected && isSupportedNetwork ? (
        <>
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
          >
            <TreeCost treeCount={campaignSize} costValue={campaignSize * 10} />
          </motion.div>
        </>
      ) : (
        <ConnectButton />
      )}
    </AnimatedPage>
  );
}

export default NewCampaignPage;
