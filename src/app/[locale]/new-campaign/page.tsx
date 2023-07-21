'use client';

import React, {useCallback, useMemo, useState} from 'react';
import {useTranslations} from 'use-intl';
import {useAccount} from 'wagmi';
import {ConnectButton} from '@rainbow-me/rainbowkit';

import {TreeCost} from '@forest-feed/components/TreeCost/TreeCost';
import {Stepper} from '@forest-feed/components/kit/Stepper';
import {GeneralInfoStep, GeneralInfoStepState} from '@forest-feed/components/NewCampaignStepper/GeneralInfoStep';
import {PledgeStep, PledgeStepState} from '@forest-feed/components/NewCampaignStepper/PledgeStep';
import {useCampaignJourney} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';

function NewCampaignPage() {
  const [activeStep, setActiveStep] = useState(0);

  const [treeCount, setTreeCount] = useState<number>(1);

  const {campaignJourney, dispatchApproveGeneralInfo, dispatchApprovePledge} = useCampaignJourney();

  console.log(campaignJourney, 'campaignJourney state');

  const t = useTranslations('newCampaign.stepper');

  const handleChangeTreeCount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTreeCount(+e.target.value);
  }, []);

  const handleApproveGeneralInfo = useCallback(
    (generalInfo: GeneralInfoStepState) => {
      setActiveStep(1);
      dispatchApproveGeneralInfo(generalInfo);
    },
    [dispatchApproveGeneralInfo],
  );

  const handleApproveReview = useCallback(() => {
    setActiveStep(3);
  }, []);
  const handleApprovePledge = useCallback(
    (pledgeState: PledgeStepState) => {
      setActiveStep(2);
      dispatchApprovePledge(pledgeState);
    },
    [dispatchApprovePledge],
  );

  const {address} = useAccount();

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
    <div className="grid grid-cols-6 gap-4">
      {address ? (
        <>
          <div className="col-span-5">
            <Stepper
              isDependent
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              contents={[
                {
                  content: (
                    <GeneralInfoStep
                      defaultValues={generalInfoState}
                      isConfirm={false}
                      setActiveStep={setActiveStep}
                      onProceed={handleApproveGeneralInfo}
                      key="general-info-form"
                    />
                  ),
                  title: t('generalInfo'),
                },
                {
                  content: (
                    <PledgeStep
                      defaultValues={pledgeState}
                      setActiveStep={setActiveStep}
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
                      setActiveStep={setActiveStep}
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
          <div className="col-span-1">
            <TreeCost treeCount={treeCount} onChangeTrees={handleChangeTreeCount} costValue={treeCount * 2} />
          </div>
        </>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}

export default NewCampaignPage;
