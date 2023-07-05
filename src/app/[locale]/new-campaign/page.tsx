'use client';

import React, {useCallback, useState} from 'react';

import {TreeCost} from '@forest-feed/components/TreeCost/TreeCost';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {Stepper} from '@forest-feed/components/kit/Stepper';
import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {GeneralInfoStep} from '@forest-feed/components/NewCampaignStapper/GeneralInfoStep';
import {PledgeStep} from '@forest-feed/components/NewCampaignStapper/PledgeStep';

function NewCampaignPage() {
  const [activeStep, setActiveStep] = useState(0);

  const [treeCount, setTreeCount] = useState<number>(1);

  const handleChangeTreeCount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTreeCount(+e.target.value);
  }, []);

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-6 gap-4">
        <div>
          <Button text="NEW CAMPAIGN" variant={ButtonVariant.menu} />
          <Spacer />
          <Button text="MY CAMPAIGN" variant={ButtonVariant.text} />
        </div>
        <div className="col-span-4">
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
        <div>
          <TreeCost treeCount={treeCount} onChangeTrees={handleChangeTreeCount} costValue={treeCount * 2} />
        </div>
      </div>
    </div>
  );
}

export default NewCampaignPage;
