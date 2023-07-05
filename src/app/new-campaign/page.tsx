'use client';

import React, {useCallback, useState} from 'react';

import {TreeCost} from '@forest-feed/components/TreeCost/TreeCost';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {Stepper} from '@forest-feed/components/kit/Stepper';
import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {GeneralInfoStep} from '@forest-feed/components/NewCampaignStepper/GeneralInfoStep';
import {PledgeStep} from '@forest-feed/components/NewCampaignStepper/PledgeStep';

function NewCampaignPage() {
  const [activeStep, setActiveStep] = useState(0);

  const [treeCount, setTreeCount] = useState<number>(1);

  const handleChangeTreeCount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTreeCount(+e.target.value);
  }, []);

  return (
    <div className="grid grid-cols-6 gap-20">
      <div className="col-span-5">
        <Stepper
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          contents={[
            {
              content: <GeneralInfoStep isConfirm={false} setActiveStep={setActiveStep} />,
              title: 'General Info',
            },
            {
              content: <PledgeStep />,
              title: 'Pledge',
            },
            {
              content: <GeneralInfoStep isConfirm setActiveStep={setActiveStep} />,
              title: 'Confirm',
            },
            {
              content: <div>Step 4</div>,
              title: 'Share',
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
