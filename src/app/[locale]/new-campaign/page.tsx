'use client';

import React, {useCallback, useState} from 'react';
import {useTranslations} from 'use-intl';

import {TreeCost} from '@forest-feed/components/TreeCost/TreeCost';
import {Stepper} from '@forest-feed/components/kit/Stepper';
import {GeneralInfoStep} from '@forest-feed/components/NewCampaignStepper/GeneralInfoStep';
import {PledgeStep} from '@forest-feed/components/NewCampaignStepper/PledgeStep';
import {Counter} from '@forest-feed/components/counter/Counter';
import {useCampaignJourney} from '@forest-feed/redux/module/campaignJourney/campaignJourney';

function NewCampaignPage() {
  const [activeStep, setActiveStep] = useState(0);

  const [treeCount, setTreeCount] = useState<number>(1);

  const {dispatchApproveGeneralInfo, campaignJourney} = useCampaignJourney();
  console.log(campaignJourney);

  const t = useTranslations('newCampaign.stepper');

  const handleChangeTreeCount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTreeCount(+e.target.value);
  }, []);

  const handleApproveGeneralInfo = (content: string, image: File) => {
    setActiveStep(1);
    dispatchApproveGeneralInfo({
      content,
      image,
    });
  };

  const handleApproveReview = () => {
    setActiveStep(3);
  };
  const handleApprovePledge = (
    size: number,
    reward: {minimumFollowerNumber: number; onlyFollowers: '0' | '1'},
    settings: {canBeCollected: '0' | '1'; canBeCollectedOnlyFollowers: '0' | '1'},
  ) => {
    setActiveStep(2);
  };

  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="col-span-5">
        <Stepper
          isDependent
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          contents={[
            {
              content: (
                <GeneralInfoStep isConfirm={false} setActiveStep={setActiveStep} onProceed={handleApproveGeneralInfo} />
              ),
              title: t('generalInfo'),
            },
            {
              content: <PledgeStep setActiveStep={setActiveStep} onProceed={handleApprovePledge} />,
              title: t('pledge'),
            },
            {
              content: <GeneralInfoStep isConfirm setActiveStep={setActiveStep} onProceed={handleApproveReview} />,
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
        <Counter />
      </div>
    </div>
  );
}

export default NewCampaignPage;
