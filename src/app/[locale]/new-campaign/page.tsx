'use client';

import React, {useCallback, useState} from 'react';
import {useTranslations} from 'use-intl';

import {TreeCost} from '@forest-feed/components/TreeCost/TreeCost';
import {Stepper} from '@forest-feed/components/kit/Stepper';
import {GeneralInfoStep} from '@forest-feed/components/NewCampaignStepper/GeneralInfoStep';
import {PledgeStep} from '@forest-feed/components/NewCampaignStepper/PledgeStep';

function NewCampaignPage() {
  const [activeStep, setActiveStep] = useState(0);

  const [treeCount, setTreeCount] = useState<number>(1);

  const t = useTranslations('newCampaign.stepper');

  const handleChangeTreeCount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTreeCount(+e.target.value);
  }, []);

  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="col-span-5">
        <Stepper
          isDependent
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          contents={[
            {
              content: <GeneralInfoStep isConfirm={false} setActiveStep={setActiveStep} />,
              title: t('generalInfo'),
            },
            {
              content: <PledgeStep setActiveStep={setActiveStep} />,
              title: t('pledge'),
            },
            {
              content: <GeneralInfoStep isConfirm setActiveStep={setActiveStep} />,
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
    </div>
  );
}

export default NewCampaignPage;
